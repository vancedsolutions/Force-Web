import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import parse from "html-react-parser";
const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
export default function ToolTipButton(props) {


  return (
      <div>
          
          <HtmlTooltip title={(<React.Fragment><p>{parse(props.textMessage ) }</p></React.Fragment>)} placement="left">
              <button className="primary" onClick={props.action} disabled={props.loading}>{props.name }</button>
      </HtmlTooltip>
      
    </div>
  );
}
