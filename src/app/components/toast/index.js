
import {
    toast
  } from 'react-toastify';
  
  import 'react-toastify/dist/ReactToastify.css';


toast.configure();
 const ToastMessage = (props) => {
     let msg = props;
    // eslint-disable-next-line default-case
     switch (msg.type) {
        
        case "error":
            toast.error(msg.message);
            break;
        case "success":
            toast.success(msg.message);
            break;
        case "warning":
        toast.warning(msg.message);
            break
       }

}

export default ToastMessage;