import React, { Component } from 'react';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            premises: null,
            premiseLabels: [],
            premiseType: '',
            properties: null
        };

        this.onLabelChange = this.onLabelChange.bind(this);
        this.onPremiseChange = this.onPremiseChange.bind(this);
        this.onPropertiesChange = this.onPropertiesChange.bind(this);
    }

    onLabelChange = (e) => {
        e.preventDefault();
        document.getElementById('premises').selectedIndex = 0;
        document.getElementById('properties').selectedIndex = 0;

        const sizeObject = this.props.labels.find(label => label.label === e.target.value);
        const premiseLabels = [];

        const premises = this.props.areas.filter(area => {
            const found = area.area >= sizeObject.from && area.area <= sizeObject.to;
            if (found) {
                if (!premiseLabels.includes(area.type)) {
                    premiseLabels.push(area.type);
                }
            }

            return found;
        });

        this.setState({
            premises: premises,
            premiseLabels: premiseLabels,
            premiseType: '',
            properties: null
        });

    }

    onPremiseChange = (e) => {
        e.preventDefault();
        document.getElementById('properties').selectedIndex = 0;

        const properties = this.state.premises.filter(premise => {
            return premise.type === e.target.value;
        });

        this.setState({
            properties: properties,
            premiseType: e.target.value
        });
    }

    onPropertiesChange = (e) => {
        e.preventDefault();
        this.props.handlePropertyChange(e.target.value, this.state.premiseType);
    }

    render() {
        return (
            <div id="header">
                <div className="content">
                    <select id="areas" name="areas"
                        onChange={this.onLabelChange}>
                        <option>Choose Area</option>
                        {this.props.labels.map((label, i) => {
                            return <option key={i} value={label.label}>{label.label}</option>
                        })}
                    </select>

                    <select id="premises" name="premises" defaultValue="default"
                        onChange={this.onPremiseChange} disabled={!this.state.premises}>
                        <option name="default">Choose Premise</option>
                        {this.state.premiseLabels && this.state.premiseLabels.map((label, i) => {
                            return <option key={i} value={label}>{label}</option>
                        })}
                    </select>


                    <select id="properties" name="properties"
                        onChange={this.onPropertiesChange} disabled={!this.state.properties}>
                        <option>Choose Property</option>
                        {this.state.properties && this.state.properties.map((property, i) => {
                            return <option key={i} value={property.id}>{property.propertyName}</option>
                        })}
                    </select>

                </div>

            </div>
        );
    }
}

export default Header;