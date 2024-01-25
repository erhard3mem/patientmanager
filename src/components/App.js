import React, { Component } from 'react'
import PatientList from './PatientList'
import CreatePatient from './CreatePatient'
import CreateDiagnosis from './CreateDiagnosis'
import CreateMedication from './CreateMedication'
import CreateInsurance from './CreateInsurance'
import Header from './Header'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import AnonymPatientList from './AnonymPatientList';
import CreateBulkDiagnoses from './CreateBulkDiagnoses';

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>   
            <Route exact path="/" component={Home} />        
            <Route exact path="/createPatient" component={CreatePatient} />
            <Route exact path="/createMedication" component={CreateMedication} />
            <Route exact path="/createInsurance" component={CreateInsurance} />
            <Route exact path="/createDiagnosis" component={CreateDiagnosis} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/patients" component={PatientList} />
            <Route exact path="/anonymPatients" component={AnonymPatientList} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
