import React, { Component } from 'react'
import { graphql, Query, Mutation } from 'react-apollo'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import gql from 'graphql-tag'
import Select from 'react-select'



const DIAGNOSES_QUERY = gql`
  query GetAllDiagnoses($name: String!)  {
    searchDiagnoses(name:$name) {
          id
          name
    }
  }
`

const MEDICATIONS_QUERY = gql`
  query GetAllMedications {
    allMedications {
          id
          name
    }
  }
`


const NEW_RECORD_MUTATION = gql`
  mutation NewRecordMutation($patientId: ID!, $diagnosisId: ID!, $date: String!, $details: String!) {
    newRecord(patientId: $patientId, diagnosisId: $diagnosisId, date: $date, details: $details, discharged: false) {
      id      
    }
  }
`

const NEW_PRESCRIPTION_MUTATION = gql`
  mutation NewPrescriptionMutation($patientId: ID!, $diagnosisId: ID!, $medicationId: ID!, $dosis: String!) {
    newPrescription(patientId: $patientId, diagnosisId: $diagnosisId, medicationId: $medicationId, dosis: $dosis) {
      id      
    }
  }
`

const DISCHARGE_MUTATION = gql`
 mutation Discharge($recordId: ID!, $discharged: Boolean!) {
   discharge(recordId: $recordId, discharged: $discharged) {
     id
   }
 }`

class PatientDetails extends Component {
  state = {
    diagnosisId: '',
    medicationId: '',
    details: '',
    date: '',
    dosis: '',
    diagnosesSearch: '',
    searchForDiagnoses: false
  }

  getFormattedDate(d) {
    var bdate = d && new Date(d)
    if(bdate) {
      return bdate.getDate() + "."+(bdate.getMonth()+1)+"."+bdate.getFullYear()
    }
  }

  getAge(dateString) 
  {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age--;
      }
      return age;
  }

  componentWillReceiveProps(props) {
    const { refresh, id } = this.props;
    if (props.refresh !== refresh) {
      debugger
    }
  }

  render() {
    const patient = this.props.patient;
    
    if(!patient) {
      return (<div></div>)
    }

    const { diagnosisId, medicationId, date, details, dosis, info, diagnosesSearch } = this.state
    const patientId = patient.id

    return (
        <div className="patientDetails">
        {this.state.info && <div className="info">
          {this.state.info}</div>}
        <br />
    <h4>{patient.fName} {patient.lName}, {patient.sex} ({this.getFormattedDate(patient.bDate)} / {this.getAge(patient.bDate)})  {patient.insurance && <span className="bordered">{patient.insurance.name}</span>}  </h4>
          <div className="records fl minHeight500Px">
            <b>Medical records:</b><br />
            <ul>{patient.records && patient.records.map((r,index)=>(<li className={"height25px "+(r.discharged?'lt':'n')}>{this.getFormattedDate(r.date)} / {r.diagnosis.name} / <span className="bordered">{r.details}</span>  
            
             <Mutation
                mutation={DISCHARGE_MUTATION}
               // variables={{ recordId: recordId, discharged: discharged }}
                refetchQueries={["GetAllPatients"]}                
                onCompleted={()=>this.setState({/*info:'Patient (not) discharged ('+patient.lName+')'*/})}
              >
                {discharge => <input onChange={(e)=>{discharge({variables:{recordId:r.id,discharged:e.target.checked}})}} type="checkbox" defaultChecked={r.discharged}></input>}
              </Mutation>
            
            
            </li>))}</ul>

            <div>
              <div className="flex flex-column mt3"> 
              <input placeholder="find diagnoses.." type="text" onChange={(e)=>{this.setState({diagnosesSearch:e.target.value})}}></input>    
                {diagnosesSearch && <Query query={DIAGNOSES_QUERY} variables={{name:diagnosesSearch}}>
                  {({ loading, error, data }) => {
                    
                    if (loading) return <div>Fetching diagnosis..</div>
                    if (error) return <div>Error (diagnosis)</div> 
              
                    var options = []
                    data.searchDiagnoses.map((d,index) => options.push({value:d.id,label:d.name}));

                    return (<Select className="maxWidth500Px" options={options} onChange={(e)=>{this.setState({diagnosisId:e.value})}}></Select>)
                  }}
                </Query>}             
                <textarea
                  className="mb2"
                  value={details}
                  onChange={e => this.setState({ details: e.target.value })}
                  type="text"
                  placeholder="Medical record details"
                />
                <DatePicker
                    selected={this.state.date}
                    onChange={d => this.setState({date:d})}
                />
              </div>
              <Mutation
                mutation={NEW_RECORD_MUTATION}
                variables={{ patientId, diagnosisId, date, details }}
                refetchQueries={["GetAllPatients"]}                
                onCompleted={()=>this.setState({selectedPatient:'', date:'', details: ''/*,info:'Record created ('+patient.lName+')'*/})}
              >
                {createMutation => <button onClick={createMutation}>Submit Record</button>}
              </Mutation>
            </div>
          </div>
          <div className="prescriptions fl minHeight500Px">
            <b>Prescriptions:</b><br />
            <ul>{patient.prescriptions && patient.prescriptions.map((p,index)=>(<li className="height25px n">{p.diagnosis.name} / {p.medication.name} <span className="bordered">{p.dosis}</span></li>))}</ul>

            <div>
              <div className="flex flex-column mt3">              
              <input placeholder="find diagnoses.." type="text" onChange={(e)=>{this.setState({diagnosesSearch:e.target.value})}}></input>    
                {diagnosesSearch && <Query query={DIAGNOSES_QUERY} variables={{name:diagnosesSearch}}>
                  {({ loading, error, data }) => {
                    
                    if (loading) return <div>Fetching diagnosis..</div>
                    if (error) return <div>Error (diagnosis)</div> 
              
                    var options = []
                    data.searchDiagnoses.map((d,index) => options.push({value:d.id,label:d.name}));

                    return (<Select className="maxWidth500Px" options={options} onChange={(e)=>{this.setState({diagnosisId:e.value})}}></Select>)
                  }}
                </Query>} 
                <Query query={MEDICATIONS_QUERY}>
                  {({ loading, error, data }) => {
                    
                    if (loading) return <div>medications..</div>
                    if (error) return <div>Error (medications)</div> 
              
                    var options = []
                    data.allMedications.map((m,index) => options.push({value:m.id,label:m.name}));

                    return (<Select className="maxWidth500Px" options={options} onChange={(e)=>{this.setState({medicationId:e.value})}}></Select>)
                  }}
                </Query>                              
                <input
                  className="mb2"
                  value={dosis}
                  onChange={e => this.setState({ dosis: e.target.value })}
                  type="text"
                  placeholder="Prescription dosis"
                />                
              </div>
              <Mutation
                mutation={NEW_PRESCRIPTION_MUTATION}
                variables={{ patientId, diagnosisId, medicationId, dosis }}
                refetchQueries={["GetAllPatients"]}
                onCompleted={()=>this.setState({selectedPatient:'', dosis:''/*,info:'Prescription created ('+patient.lName+')'*/})}
              >
                {createMutation => <button onClick={createMutation}>Submit Prescription</button>}
              </Mutation>
            </div>
          </div>          
        </div>
    )
  }
}

export default PatientDetails

/*<button className="closeBtn" onClick={()=>this.setState({info:'',selectedPatient:''})}>X</button>*/