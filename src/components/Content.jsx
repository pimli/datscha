import React, { Component } from 'react';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps = (nextProps, prevStat) => {
        return {
            name: nextProps.property.name,
            premiseType: nextProps.premiseType,
            premise: nextProps.property.premisesTypes.filter(pt => {
                return pt.type === nextProps.premiseType;
            })[0]
        };
    }

    render() {
        return (
            <div>
                {this.state.premise &&
                    <div>
                        <h1>{this.state.name}</h1>
                        <ul>
                            <li>Area: {this.state.premise.area}</li>
                            <li>Rent: {this.state.premise.rent}</li>
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

export default Content;