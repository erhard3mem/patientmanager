import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'


const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {   
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { email, password, name } = this.state
    return (
      <div className="padding30px">
        <h4 className="mv3">{'Login'}</h4>
        <div className="flex flex-column">          
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Your password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={LOGIN_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {'login'}
              </div>
            )}
          </Mutation>          
        </div>
      </div>
    )
  }

  _confirm = async data => {
    const { token } = data.login
    this._saveUserData(token)
    this.props.history.push(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

export default Login
