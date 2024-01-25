import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex pa1 justify-between nowrap white borderBottom2Px">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1 headtitle hospitalIcon"><a href="/">PatientManagement</a></div>  
          {authToken && (
            <div className="flex links">
                <Link to="/patients" className="ml1 no-underline black">
                  patients
                </Link>
                <Link to="/createPatient" className="ml1 no-underline black">
                  create patient
                </Link>
                <Link to="/createMedication" className="ml1 no-underline black">
                  create medication
                </Link>
                <Link to="/createDiagnosis" className="ml1 no-underline black">
                  create diagnosis
                </Link>
                <Link to="/createInsurance" className="ml1 no-underline black">
                  create insurance
                </Link>
                <Link to="/anonymPatients" className="ml1 no-underline black">
                  anonym patients list
                </Link>
            </div>
          )}
        </div>
        <div className="flex flex-fixed loginBtn">
          {authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                this.props.history.push(`/`)
              }}
            >
              logout
            </div>
          ) : (
              <Link to="/login" className="ml1 no-underline black">
                login
            </Link>
            )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)