import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const NEW_DIAGNOSIS_MUTATION = gql`
  mutation NewDiagnosisMutation($name: String!) {
    newDiagnosis(name: $name) {
      id
      name
    }
  }
`

class CreateDiagnosis extends Component {
  state = {
    name: ''
  }

   render() {
    const { name } = this.state
    return (
      <div className="padding30px"><h2>Create Diagnosis</h2>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Diagnosis name"
          />
        </div>
        {this.state.info && <div className="info">
          {this.state.info}
        </div>}
        <Mutation
          mutation={NEW_DIAGNOSIS_MUTATION}
          variables={{ name }}
          refetchQueries={["GetAllDiagnoses"]}
          onCompleted={()=>{this.setState({info:'Diagnosis created'})}}
        >
          {createMutation => <button onClick={createMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateDiagnosis