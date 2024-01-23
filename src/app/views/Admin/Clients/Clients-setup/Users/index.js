import React, { Component } from 'react'

class UserView extends Component {
  render() {
    return (


      <>

        <div className="userList">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email </th>
                <th>Last login</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mayert Troy</td>
                <td>makayla.larkin@hotmail.com</td>
                <td>23rd april 2021</td>
                <td> <span className="userOffline"></span>Offline</td>
              </tr>
              <tr>
                <td>Cartwright Dina</td>
                <td>maverick.leuschke@yahoo.com</td>
                <td>22nd april 2021</td>
                <td><span className="userOnline"></span> Online</td>
              </tr>

            </tbody>
          </table>
        </div>

      </>
    );
  }
};

export default UserView;
