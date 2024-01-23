import {createStyles} from "@material-ui/core";

const style = createStyles({
    paper: {
        paddingTop: '20%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        margin: 1,
        backgroundColor: '#ccc',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: 1,
    },
    submit: {
        margin: '3px 0px 2px',
    },
});
export default style
