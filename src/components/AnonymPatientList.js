import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import gql from 'graphql-tag'
import Select from 'react-select'
import _ from 'lodash'

const PATIENTS_QUERY = gql`
  query GetAllPatients {
    allPatients {          
          bDate
          sex 
          records { diagnosis { name } discharged }
          prescriptions { dosis medication { name } }
    }
  }
`

class AnonymPatientList extends Component {
  state = {   
  }
  
  getDiagnosisFromRecords(rs) {
    return _.map(_.map(_.map(rs,function(r){ return r.discharged===false?r:null}),'diagnosis'),'name').filter(function(r){return r!==undefined}).join(', ');
  }

  getMedicationsFromPrescriptions(ps) {
    let str = '';
    ps.map((p,index)=>(str+=p.medication.name+" ("+p.dosis+")"));
    return str;
  }

  getFormattedDate(d) {
    var bdate = d && new Date(d)
    if(bdate) {
      debugger
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
    return (
        <div className="padding30px"><h2>Anonymized Patients list</h2>
        <Query query={PATIENTS_QUERY}>
          {({ loading, error, data }) => {
            
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div> 
      
            return (
              <table className="anonymPatientsTable">
                {data.allPatients.map((p,index) => (<tr><td className="darkred">{this.getAge(p.bDate)} years</td><td className="darkgreen">{p.sex}</td><td className="purple">{this.getDiagnosisFromRecords(p.records)}</td><td className="blue">{this.getMedicationsFromPrescriptions(p.prescriptions)}</td></tr>))}
              </table>            
            )
          }}
        </Query>       
        </div>
    )
  }
}

export default AnonymPatientList