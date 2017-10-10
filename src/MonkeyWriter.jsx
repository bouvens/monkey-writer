import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { big } from './constants/texts'

export default class MonkeyWriter extends Component {
    static propTypes = {
        initialText: PropTypes.string,
        textLength: PropTypes.number,
        level: PropTypes.number,
    }

    static defaultProps = {
        initialText: big,
        textLength: 2000,
        level: 1,
    }

    state = {
        level: this.props.level,
        frequencies: {},
        initialText: '',
    }

    componentWillMount () {
        this.calculateFrequencies(this.generateText)
    }

    lastChars = []

    calculateFrequencies = (callback) => {
        const text = this.props.initialText.split('')
        const lastChars = text.splice(0, this.state.level)

        const frequencies = _.reduce(text, (f, char) => {
            const frequency = _.get(f, lastChars)

            _.setWith(f, lastChars, _.isUndefined(frequency) ? 1 : frequency + 1, Object)

            lastChars.shift()
            lastChars.push(char)

            return f
        }, {})

        this.setState({ frequencies }, callback)
    }

    generateChar = () => {
        const frequencies = _.isEmpty(this.lastChars)
            ? this.state.frequencies
            : _.get(this.state.frequencies, this.lastChars)
        const sum = _.reduce(frequencies, _.add, 0)
        let random = Math.ceil(Math.random() * sum)

        const nextChar = _.findKey(frequencies, (num) => {
            random -= num

            return random <= 0
        })

        if (!_.isEmpty(this.lastChars)) {
            this.lastChars.shift()
            this.lastChars.push(nextChar)
        }

        return nextChar
    }

    generateText = () => {
        const text = []
        this.lastChars = this.props.initialText
            .substr(Math.floor(Math.random() * (this.props.textLength - this.state.level)), this.state.level - 1)
            .split('')

        for (let i = 0; i <= this.props.textLength; i += 1) {
            text.push(this.generateChar())
        }

        this.setState({ initialText: text.join('') })
    }

    render () {
        // todo сделать нормальные стили элементов
        return (
            <div>
                <button onClick={this.generateText}>Regenerate</button>
                <p><strong>Generated text:</strong></p>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.initialText}</pre>
                <p><strong>Frequencies:</strong></p>
                <div>{JSON.stringify(this.state.frequencies, null, 2)}</div>
            </div>
        )
    }
}
