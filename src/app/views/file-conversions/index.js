import React, { Component } from 'react'
import BankUploadsView from './bank-uploads';
import TaxPaymentsView from './tax-payments';
import TaxCollectionView from './tax-collection';
import SOHTool from './soh-tool';
import DirectDeposit from './direct-deposit-upload';
import NewHireCheckView from './new-hire-upload';
import { connect } from "react-redux";
import './style.scss';

class ConversationToolsView extends Component {
    constructor(props) {
        super(props);

    }

    isPermission(key) {
        return !!this.props.USER?.permissions?.find(p => p.isActive && p.key === key);
    }

    render() {
        return (
            <>
                <h3 className="heading_h3">File Conversions</h3>

                <div className="ConversationToolsView">
                    {this.isPermission('BANK_UPLOAD') && (<BankUploadsView />)}
                    {this.isPermission('TAX_PAYMENTS') && (<TaxCollectionView />)}
                    {this.isPermission('TAX_COLLECTION') && (<TaxPaymentsView />)}
                    {this.isPermission('NEW_HIRE') && (<NewHireCheckView />)}
                    {this.isPermission('DIRECT_DEPOSIT_TOOL') && (<DirectDeposit />)}
                    {this.isPermission('SPREAD_OF_HOURS_TOOL') && (<SOHTool />)}
                </div>

            </>
        )
    }
}

const mapStateToProps = (state) => ({ USER: state.USER });
export default connect(mapStateToProps)(ConversationToolsView)
