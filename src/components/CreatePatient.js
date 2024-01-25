import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import gql from 'graphql-tag'
import Select from 'react-select'

const NEW_PATIENT_MUTATION = gql`
  mutation NewPatientMutation($fName: String!, $lName: String!, $bDate: String!, $sex: String!, $insuranceId: ID!) {
    newPatient(fName: $fName, lName: $lName, bDate: $bDate, sex: $sex, insuranceId: $insuranceId) {
      id
      fName
      lName
      bDate
      sex
    }
  }
`


const INSURANCES_QUERY = gql`
  query GetAllInsurances {
    allInsurances {
          id
          name
    }
  }
`

class CreatePatient extends Component {
  state = {
    fName: '',
    lName: '',
    bDate: null,
    sex: '',
    insuranceId:''
  }
 

  render() {
    const { fName, lName, bDate, sex, insuranceId } = this.state
    return (
      <div className="padding30px"><h2>Create Patient</h2>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={fName}
            onChange={e => this.setState({ fName: e.target.value })}
            type="text"
            placeholder="First name"
          />
          <input
            className="mb2"
            value={lName}
            onChange={e => this.setState({ lName: e.target.value })}
            type="text"
            placeholder="Last name"
          />
         <DatePicker
              selected={this.state.bDate}
              onChange={d => this.setState({bDate:d})}
          />
          <input
            className="mb2"
            value={sex}
            onChange={e => this.setState({ sex: e.target.value })}
            type="text"
            placeholder="Sex"
          />
            <Query query={INSURANCES_QUERY}>
                  {({ loading, error, data }) => {
                    
                    if (loading) return <div>insurances..</div>
                    if (error) return <div>Error (insurances)</div> 
              
                    var options = []
                    data.allInsurances.map((m,index) => options.push({value:m.id,label:m.name}));

                    return (<Select className="maxWidth500Px" options={options} onChange={(e)=>{this.setState({insuranceId:e.value})}}></Select>)
                  }}
                </Query>  
        </div>
        {this.state.info && <div className="info">
          {this.state.info}
        </div>}
        <Mutation
          mutation={NEW_PATIENT_MUTATION}
          variables={{ fName, lName, bDate, sex, insuranceId }}
          refetchQueries={["GetAllPatients"]}
          onCompleted={()=>{this.setState({fName:'',lName:'',bDate:'',sex:'',insuranceId:'',info:'Patient created'})}}
        >
          {createMutation => <button onClick={createMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreatePatient