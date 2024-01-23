import React, { useState, useEffect } from "react";
import "./AddLevel.scss";
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
export const AddLevel = (props) => {

    const [level, setLevel] = useState("");
    const [maxAccounts, setMaxAccounts] = useState("");
    const [maxEmployees, setMaxEmployees] = useState("");
    const [maxEnterprise, setMaxEnterprise] = useState("");
    const [arrayList, setArrayList] = useState([]);
    const [editData, setEditData] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const save = async ($e) => {
        $e.preventDefault();
        let hasLevel = props.action.CSR.capacityLevel.filter(el => el.level == level)
        if (hasLevel.length) {
            setErrMessage("Level is already added.")
        } else {
            const data = {
                level,
                maxAccounts,
                maxEmployees,
                maxEnterprise
            }
            setArrayList(data)
            arrayList.push(data)
            let payload = {
                capacityLevel: arrayList
            }
            await props.action.addCsrAssignments(payload)
            props.close()
            props.refreshGrid()
        }

    }

    useEffect(async () => {
        let preList = props.action.CSR.capacityLevel
        setArrayList(preList)
        setEditData(props.isEditData)
        editRow()

    }, [])

    const editRow = () => {
        if (props.isEditData) {
            const { level, maxAccounts, maxEmployees, maxEnterprise, _id } = props.isEditRow
            setLevel(level)
            setMaxAccounts(maxAccounts)
            setMaxEmployees(maxEmployees)
            setMaxEnterprise(maxEnterprise)
        }
    }

    const update = async ($e) => {
        $e.preventDefault();
        const data = {
            _id: props.isEditRow._id,
            level,
            maxAccounts,
            maxEmployees,
            maxEnterprise
        }
        let payload = {
            capacityLevel: data
        }
        await props.action.updateCsrAssignments(payload)
        props.close()
        props.refreshGrid()

    }

    return (
        <div>
            {editData ?
                <div className="add_rate_popup cntnt_wrpr">
                    <div className="date_column">
                        <label className="fs14">Start Level</label><br></br>
                        <input type="number" id="txtRole" value={level} onChange={(event) => setLevel(event.target.value)}  ></input>
                    </div>
                    <div>
                        <label className="fs14">Enterprise</label> <br></br>
                        <input type="number" id="txtRole" value={maxEnterprise} onChange={(event) => setMaxEnterprise(event.target.value)}  ></input>
                    </div>
                    <div className="date_column">
                        <label className="fs14">Minimum</label><br></br>
                        <input type="number" id="txtRole" value={maxAccounts} onChange={(event) => setMaxAccounts(event.target.value)}  ></input>
                    </div>

                    <div className="date_column">
                        <label className="fs14">Employees</label> <br></br>
                        <input type="number" id="txtRole" value={maxEmployees} onChange={(event) => setMaxEmployees(event.target.value)}  ></input>
                    </div>
                    <div className="df acsa ftr">
                        <div className="mla">
                            <button className="mla ttuc fs12 text mini" onClick={() => props.close()}>Cancel</button>
                            <button className="mla ttuc fs12 primary mini"
                                onClick={update}>Update
                            </button>
                        </div>
                    </div>
                </div>

                :
                <div className="add_rate_popup cntnt_wrpr">
                    <div className="date_column">
                        <label className="fs14">Start Level</label><br></br>
                        <input type="number" id="txtRole" value={level} onChange={(event) => setLevel(event.target.value)}  ></input>
                        <span className="text-danger"><small>{errMessage}</small></span>
                    </div>
                    <div>
                        <label className="fs14">Enterprise</label> <br></br>
                        <input type="number" id="txtRole" value={maxEnterprise} onChange={(event) => setMaxEnterprise(event.target.value)}  ></input>
                    </div>
                    <div className="date_column">
                        <label className="fs14">Minimum</label><br></br>
                        <input type="number" id="txtRole" value={maxAccounts} onChange={(event) => setMaxAccounts(event.target.value)}  ></input>
                    </div>

                    <div className="date_column">
                        <label className="fs14">Employees</label> <br></br>
                        <input type="number" id="txtRole" value={maxEmployees} onChange={(event) => setMaxEmployees(event.target.value)}  ></input>
                    </div>

                    <div className="df acsa ftr">
                        <div className="mla">
                            <button className="mla ttuc fs12 text mini" onClick={() => props.close()}>Cancel</button>
                            <button className="mla ttuc fs12 primary mini"
                                onClick={save}>Save
                                {/* {!adding ? Object.keys(editData).length ? 'Update' : 'Save' : ''} */}
                            </button>
                        </div>
                    </div>
                </div>
            }



        </div>

    );
};
