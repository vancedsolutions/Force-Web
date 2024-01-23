import React, { Component } from 'react'
import { connect } from "react-redux";
import { getBillingServices } from "../../../../store/actions/Admin/billing-services";
import BillingServiceView from './billing-service'
class BillingServices extends Component {
    render() {
        return (
            <>
                <h2 className="page_title">Billing Discrepancy</h2>
                <BillingServiceView />
            </>
        )
    }
}


const mapStateToProps = ({ BillingServices }) => ({ BillingServices });
export default connect(mapStateToProps, { getBillingServices })(BillingServices);
