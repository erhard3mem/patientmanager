import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const NEW_INSURANCE_MUTATION = gql`
  mutation NewInsuranceMutation($name: String!) {
    newInsurance(name: $name) {
      id
      name
    }
  }
`

class CreateInsurance extends Component {
  state = {
    name: ''
  }

   render() {
    const { name } = this.state
    return (
      <div className="padding30px"><h2>Create Insurance</h2>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Insurance name"
          />
        </div>
        {this.state.info && <div className="info">
          {this.state.info}
        </div>}
        <Mutation
          mutation={NEW_INSURANCE_MUTATION}
          variables={{ name }}
          refetchQueries={["GetAllInsurances"]}
          onCompleted={()=>{this.setState({info:'Insurance created'})}}
        >
          {createMutation => <button onClick={createMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateInsurance