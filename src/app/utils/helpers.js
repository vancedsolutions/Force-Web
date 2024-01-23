
import { Storage } from './storage'
import jwt_decode from 'jwt-decode';
let menuList = [];
let isChildren = false;
let isFileConversion = false;
export const isAdminUser = (Menu, IsPermissionList) => {
  if (IsPermissionList.length) {
    menuList = [...Menu];

    isFileConversion = IsPermissionList.find(permission => {

      if ((permission.key === 'BANK_UPLOAD' || permission.key === 'TAX_PAYMENTS' || permission.key === 'TAX_COLLECTION' || permission.key === 'NEW_HIRE') && permission.isActive) {
        return true;
      } else if (permission.key === 'SPREAD_OF_HOURS_TOOL' && permission.isActive) {
        return true;
      } else {
        return false;
      }
    })
    let data = isPermission(Menu, IsPermissionList);
    return data;
  }



}

const isPermission = (Menu, IsPermissionList, parentIndex) => {

  for (let i = 0; i < Menu.length; i++) {

    let isActiveMenu = IsPermissionList.filter(res => res.key === Menu[i].key);

    if (isChildren && isActiveMenu.length) {
      let findIndex = menuList[parentIndex].subs.findIndex(f => f.key === isActiveMenu[0].key);
      if (!isActiveMenu.isActive) {
        menuList[parentIndex].subs[findIndex].isActive = isActiveMenu[0].isActive;
        let isParentActive = menuList[parentIndex].subs.filter((res) => res.isActive === true).length > 0 ? true : false;
        menuList[parentIndex].isActive = isParentActive;

      }
    }

    if (Menu[i].subs.length) {
      isChildren = true;
      let parentIndex = i;
      isPermission(Menu[i].subs, IsPermissionList, parentIndex);
    }
    if (Menu[i].key === 'FILE_CONVERSION' || Menu[i].key === 'FILE_CONVERSION_ADMIN') {

      menuList[i].isActive = isFileConversion !== undefined ? isFileConversion.isActive : false;

    }

  }
  return menuList;


};




export const isLoginAs = (cases) => {

  if (cases.length > 1) {

    if ('All' === cases[0]) {
      return true;
    }
    return false;
  }

};

export const toDecimal = (value, minFraction = 0, maxFraction = 2) => {
  if (isNaN(Number(parseFloat(value)))) return value;
  return value.toLocaleString(undefined, { minimumFractionDigits: minFraction, maximumFractionDigits: maxFraction })
};

export const toCurrency = (value, currency = 'USD') => {
  if (isNaN(Number(parseFloat(value)))) return value;
  return value.toLocaleString(undefined, { style: 'currency', currency })
};

export const getUserAuth = () => {

  const { token, username, company } = (Storage.getItem('USER') || {});
  const user = { token: '', username: '', company: '' }
  if (getUserExpAuth()) {

    let userInfo = !!token ? { token: `bearer ${token}`, username, company } : user;
    return userInfo;
  } else {
    return user;
  }

};

export const getUserExpAuth = () => {
  const { token } = (Storage.getItem('USER') || {});
  if (token !== undefined) {
    let tokenExp = jwt_decode(token);
    if (tokenExp?.exp > new Date().getTime() / 1000) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

