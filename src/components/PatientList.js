import React, { Component } from 'react'
import { graphql, Query, Mutation } from 'react-apollo'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import gql from 'graphql-tag'
import Select from 'react-select'
import PatientDetails from './PatientDetails';

const PATIENTS_QUERY = gql`
  query GetAllPatients {
    allPatients {
          id
          fName
          lName
          bDate
          sex 
          insurance { id name }
          records { id date details discharged diagnosis { id name } }
          prescriptions { id dosis diagnosis { id name } medication { id name } }
    }
  }
`
/*
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
 }`*/

class PatientList extends Component {
  state = {
    selectedPatient: null,
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

  render() {
    let selectedPatient = this.state.selectedPatient;
    const { diagnosisId, medicationId, date, details, dosis, info, diagnosesSearch } = this.state
    const patientId = selectedPatient && selectedPatient.id    
    let refresh = this.state.refresh;

    return (
        <div className="padding30px"><h2>Patients list</h2><Query query={PATIENTS_QUERY}>
          {({ loading, error, data }) => {
            
            if (loading) return <div>Fetching patients..</div>
            if (error) return <div>Error (patients)</div> 

            /* update patient details */
            data.allPatients.map((p,index) => {
                if(selectedPatient && p.id === selectedPatient.id && selectedPatient !== p) { this.setState({selectedPatient: p}) }
            })
     
            return (
              <ul className="patientList">
                {data.allPatients.map((p, index) => (
                  <li className="height25px" onClick={()=>{this.setState({selectedPatient:p,info:''})}}>
                    <span className="purple">{p.fName}</span> <span className="red">{p.lName}</span> / <span className="darkred">{p.sex}</span> / <span className="darkgreen">{this.getFormattedDate(p.bDate)} / {this.getAge(p.bDate)}</span> <span className="bordered lb">{p.records.length}r</span><span className="bordered lc">{p.prescriptions.length}p</span>
                  </li>
                ))}
              </ul>              
            )
          }}
        </Query>
        <br />
        <PatientDetails refresh={refresh} patient={selectedPatient} />
        </div>
    )
  }
}

export default PatientList

/*
{this.state.info && <div className="info">
          {this.state.info}</div>}
        <br />
        {this.state.selectedPatient && <div className="patientDetails"><button className="closeBtn" onClick={()=>this.setState({info:'',selectedPatient:''})}>X</button>
          <h4>{this.state.selectedPatient.fName} {this.state.selectedPatient.lName}, {this.state.selectedPatient.sex} ({this.getFormattedDate(this.state.selectedPatient.bDate)} / {this.getAge(this.state.selectedPatient.bDate)})</h4>
          <div className="records fl w-50 minHeight500Px">
            <b>Medical records:</b><br />
            <ul>{this.state.selectedPatient.records && this.state.selectedPatient.records.map((r,index)=>(<li className={"height25px "+(r.discharged?'lt':'n')}>{this.getFormattedDate(r.date)} / {r.diagnosis.name} / <span className="bordered">{r.details}</span> / 
            
             <Mutation
                mutation={DISCHARGE_MUTATION}
               // variables={{ recordId: recordId, discharged: discharged }}
                refetchQueries={["GetAllPatients"]}                
                onCompleted={()=>this.setState({info:'Patient (not) discharged ('+this.state.selectedPatient.lName+')'})}
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
                <input
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
                onCompleted={()=>this.setState({selectedPatient:'', date:'', details: '',info:'Record created ('+this.state.selectedPatient.lName+')'})}
              >
                {createMutation => <button onClick={createMutation}>Submit Record</button>}
              </Mutation>
            </div>
          </div>
          <div className="prescriptions fl w-50 minHeight500Px">
            <b>Prescriptions:</b><br />
            <ul>{this.state.selectedPatient.prescriptions && this.state.selectedPatient.prescriptions.map((p,index)=>(<li className="height25px">{p.diagnosis.name} / {p.medication.name} <span className="bordered">{p.dosis}</span></li>))}</ul>

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
                onCompleted={()=>this.setState({selectedPatient:'', dosis:'',info:'Prescription created ('+this.state.selectedPatient.lName+')'})}
              >
                {createMutation => <button onClick={createMutation}>Submit Prescription</button>}
              </Mutation>
            </div>
          </div>          
        </div>}*/
