import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { big } from './constants/texts'

export default class MonkeyWriter extends Component {
    static propTypes = {
        text: PropTypes.string,
    }

    static defaultProps = {
        text: big,
    }

    state = {
        frequencies: {},
        text: '',
    }

    componentWillMount () {
        this.calculateFrequencies(this.generateText)
    }

    calculateFrequencies = (callback) => {
        const frequencies = _.reduce(_.split(this.props.text, ''), (f, char) => {
            f[char] = _.isUndefined(f[char]) ? 1 : f[char] + 1

            return f
        }, {})

        this.setState({ frequencies }, callback)
    }

    generateChar = () => {
        const { length } = this.props.text
        let random = Math.ceil(Math.random() * length)

        return _.findKey(this.state.frequencies, (num) => {
            random -= num

            return random <= 0
        })
    }

    generateText = () => {
        const text = []
        for (let i = 0; i <= 50; i += 1) {
            text.push(this.generateChar())
        }

        this.setState({ text: text.join('')})
    }

    render () {
        return (
            <div>
                <button onClick={this.generateText}>Regenerate</button>
                <p>Generated text:</p>
                <pre>{this.state.text}</pre>
                <p>Frequencies:</p>
                {JSON.stringify(this.state.frequencies, null, 1)}
            </div>
        )
    }
}
