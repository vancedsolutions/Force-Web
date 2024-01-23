import React, { useState,useEffect} from "react";
import Axios from "axios";
import StandAloneInpt from "../../../../components/ui/inputs/stand-alone-input/StandAloneInput";
//import loader from "../../../../assets/images/tail-spin.svg";
import DatePicker from "react-date-picker";
import "./AddWage.scss";
import moment from 'moment';
import Select from "react-select";
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "transperent" : "transperent",
        color: state.isSelected ? "black" : "black",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
    }),
    control: (provided, state) => ({
        ...provided,
        borderRadius: "0px",
    }),
    menu: (provided, state) => ({
        ...provided,
        borderRadius: "0px",
        marginTop: "6px",
    }),

    multiValueRemove: (provided, state) => ({
        display: "none",
    }),
};
export const AddWageAll = (props) => {


    const editData = props.isEditRow;
    const [startDate, updateStartDate] = useState(Object.keys(editData).length ? new Date(editData.startDate) : "");
    const [endDate, updateEndDate] = useState(Object.keys(editData).length ? editData.endDate !== "" ? new Date(editData.endDate) : "" : "");
    const [minWage, SetMinWageValue] = useState(Object.keys(editData).length ? editData.minWage : "");
    const [adding, updateAdding] = useState(false);
    const [error, ErrorMessage] = useState("");
    const [checkOverlapDate, updateOverlapDate] = useState(true);

    const save = async () => {
        let checkEndDate = (endDate !== "" && endDate!==null ) ? Date.parse(startDate) < Date.parse(endDate) : true;
        if (!checkEndDate) {
            ErrorMessage('Start Date is not greater then to End Date')
            return;
        }
        const dateStart = props.wageList.findIndex(res => moment(new Date(res.startDate), 'MM/DD/YYYY').isSame(new Date(startDate)));
        const dateEnd = props.wageList.findIndex(res => moment(new Date(res.endDate), 'MM/DD/YYYY').isSame(new Date(endDate)));
   
        if (dateStart > -1 || dateEnd>-1 ) {
            ErrorMessage('Date is invalid')
            return;
        }
        overlapDate(startDate);
     
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
    

        if (!checkOverlapDate) {
            updateOverlapDate(true);
            if (props.wageList.length) {
                updateAdding(false);
               
                if (props.wageList[props.wageList.length - 1].endDate === "") {
                    const id = props.wageList[props.wageList.length - 1]._id
                    const endDate = moment(startDate).subtract(1, 'days')
                    let updatePayload = {
                        id: id,
                        endDate: endDate
                    }
                    await props.action.UpdatePerviousDateEmptyAction(updatePayload)
                }

            }
            let addPayload = {
                country: country[0].value,
                startDate: startDate,
                endDate: endDate === '1/1/1970' ? '' : endDate,
                minWage: minWage,
            }
            await props.action.AddWageAction(addPayload);
            updateAdding(true);

            props.close(props.action.WAGE);
          

        }
     },)

    const overlapDate = (sDate) => {
        let checkOverLapeDate = true;
        if (props.wageList.length) {
            for (let i = 0; i < props.wageList.length; i++) {
                if (props.wageList[i].endDate !== "") {
                    
                    let endDate = moment(new Date(sDate), 'MM/DD/YYYY');
                    let startDate = moment(new Date(props.wageList[i].endDate), 'MM/DD/YYYY');
                    if (endDate.diff(startDate, 'days') < 0) {
                        let modiStartDate = moment(new Date(startDate)).format("MM/DD/YYYY") 
                        ErrorMessage( `Please select date after ${modiStartDate}`)
                        checkOverLapeDate=true;
                        break;
                    } else {
                        checkOverLapeDate=false;
                    }
                } else {
                    checkOverLapeDate=false;
                    break;
                }
            }
        } else {
            checkOverLapeDate=false;
           

        }
        updateOverlapDate(checkOverLapeDate);
    }

    const countryList = [];
    props.countries.forEach(el => {
        countryList.push({
            value: el._id, label: `${el.name}`
        })
    })

    const update = async () => {
      
        if (editData._id !== undefined && editData._id !== null) {
            if (props.wageList.length > 1) {
                let checkEndDate = (endDate !== "" && endDate!==null )? Date.parse(startDate) < Date.parse(endDate) : true;
                if (!checkEndDate) {
                    ErrorMessage('Start Date is not greater then to End Date')
                    return;
                }
                const dateExists = props.wageList.filter(res => moment(new Date(res.startDate), 'M/DD/YYYY').isSame(new Date(startDate)))
                if (dateExists.length > 1) {
                    ErrorMessage("Start Date is invalid");
                    return;
                }
            }

            if (checkUpdateDate()) {
                let updatePayload = {
                    id: editData._id,
                    startDate: startDate,
                    endDate: endDate == '1/1/1970' ? '' : endDate,
                    minWage: minWage,
                }
                await props.action.UpdateWageAction(updatePayload)
                updateAdding(true);
                props.close(props.action.WAGE);

            }
        }




    }

    const checkUpdateDate = () => {
    
        let checkDate = false;
        props.wageList.forEach(el => {
            if (el._id === editData._id) {
                el.startDate = startDate;
                el.endDate = endDate
            }
        });
        if (props.wageList.length > 1) {
            for (let i = 0; i < props.wageList.length; i++) {
                if (props.wageList[i].endDate !== "") {
                    let startDate = moment(new Date(props.wageList[i].startDate), 'M/DD/YYYY');
                    let endDate = moment(new Date(props.wageList[i].endDate), 'M/DD/YYYY');

                    if (endDate.diff(startDate, 'days') < 0) {
                        ErrorMessage(" Date is invalid")
                        return checkDate;
                    }
                    if (i > 0) {
                        let privousEndDate = moment(new Date(props.wageList[i - 1].endDate), 'M/DD/YYYY');
                        if (startDate.diff(privousEndDate, 'days') < 0) {
                            ErrorMessage(" Date is invalid")
                            return checkDate;
                        } else {
                            return checkDate = true;
                        }
                    }
                } else {
                    return checkDate = true;
                }
            }
        } else {
            return checkDate = true;
        }

    }


    const [country, updateCountry] = useState(countryList.filter(res => res.label === props.isSelected));
    return (
        <div>
            <div className="add_rate_popup cntnt_wrpr">
                <div>
                    <Select
                        isDisabled={props.countries || props.countries.length}
                        placeholder="Location ID"
                        options={countryList}
                        value={country}
                        onChange={updateCountry}
                        hideSelectedOptions={false}
                        styles={customStyles}
                    />
                </div>
                <div className="date_column">
                    <label className="fs14">Start Date</label><br></br>
                    <DatePicker onChange={date => updateStartDate(date)} value={startDate} />
                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}
                </div>

                <div className="date_column">
                    <label className="fs14">End Date</label> <br></br>
                    <DatePicker onChange={date => updateEndDate(date)} value={endDate} />
                </div>

                <div>

                    <label className="fs14">Min Wage</label> <br></br>

                    <StandAloneInpt
                        value={minWage}
                        id={`wageValue`}
                        change={SetMinWageValue}
                        field={"wageValue"} />
                </div>

                <div className="df acsa ftr">
                    <div className="mla">
                        <button className="mla ttuc fs12 text mini" onClick={() => props.close()}>Cancel</button>
                        <button className="mla ttuc fs12 primary mini"
                            disabled={!minWage || !startDate}
                            onClick={Object.keys(editData).length ? update : save}>
                            {!adding ? Object.keys(editData).length ? 'Update' : 'Save' : ''}
                        </button>
                    </div>
                </div>
            </div>


        </div>

    );
};
