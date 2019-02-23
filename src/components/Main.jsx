import React, { Component } from 'react';
import Content from "./Content";
import Header from "./Header";

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: null,
            properties: null,
            areas: [],
            labels: [
                { label: '0-500', from: 0, to: 500 },
                { label: '501-1000', from: 501, to: 1000 },
                { label: '1001-2000', from: 1001, to: 2000 },
                { label: '2001-5000', from: 2001, to: 5000 },
            ],
            currentProperty: null,
            premiseType: '',
            error: ''
        }

        this.doLogin = this.doLogin.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
    };

    doLogin = (event) => {
        event.preventDefault();

        // if (!event.target.checkValidity()) {
        //     return;
        // }

        const data = {
            username: event.target.elements.username.value,
            password: event.target.elements.password.value
        };

        fetch('https://datscha-fe-code-test-api.azurewebsites.net/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response;
            })
            .then(response => response.json())
            .then(response => {
                this.setState({ token: response.token });
                this.getProperties();
            })
            .catch(error => {
                this.setState({ error: 'Login Error! Please check your credentials.' });
            });
    }

    getProperties = () => {

        fetch('https://datscha-fe-code-test-api.azurewebsites.net/properties', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response;
            })
            .then(response => response.json())
            .then(response => {
                this.parseData(response);
            })
            .catch(error => {
                this.setState({ error: 'Couldn\'t find properties! Please try again later' })
            });
    }

    parseData = all => {
        let areas = all.map(property => {
            return property.premisesTypes.map(premiseType => {
                return {
                    ...premiseType,
                    id: property.id,
                    propertyName: property.name
                };
            });
        }).flat();

        this.setState({
            properties: all,
            areas: areas,
            error: ''
        });

        console.log('parsat', this.state)
    }

    handlePropertyChange = (id, premiseType) => {
        const currentProperty = this.state.properties.filter(property => {
            return property.id === id;
        });

        if (currentProperty.length > 0) {
            this.setState({
                currentProperty: currentProperty[0],
                premiseType: premiseType
            });
        }
    }

    render() {
        if (!this.state.token || this.state.error) {
            return (
                <div>
                    <div className="login-card">
                        <h1>Log on to continue</h1>

                        <div className="body">
                            <form name="login" onSubmit={this.doLogin} noValidate>
                                {/* <input id="username" type="text" required defaultValue="user"></input>
                                <input id="password" type="text" required defaultValue="password"></input> */}

                                <input id="username" type="text" required placeholder="username"></input>
                                <input id="password" type="text" required placeholder="password"></input>


                                <input type="submit" value="Logga in" />
                            </form>
                            <div className="error-text">{this.state.error}</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {this.state.labels && <Header properties={this.state.properties}
                        areas={this.state.areas}
                        labels={this.state.labels}
                        handlePropertyChange={this.handlePropertyChange}

                    />}
                    {this.state.currentProperty && <Content property={this.state.currentProperty}
                        premiseType={this.state.premiseType}
                    />}
                </div>
            );
        }
    }
}

export default Main;