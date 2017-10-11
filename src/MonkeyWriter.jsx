import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Connector, Input, SettersBlock } from 'state-control'
import { big } from './constants/texts'

const IDS = {
    level: 'level',
    sourceText: 'sourceText',
    textLength: 'textLength',
}

const setters = [
    {
        text: 'Default',
        params: {
            [IDS.level]: 2,
            [IDS.sourceText]: ' Hello World! ',
            [IDS.textLength]: 100,
        },
    },
    {
        text: 'Big text',
        params: {
            [IDS.level]: 5,
            [IDS.sourceText]: big,
            [IDS.textLength]: 2000,
        },
    },
]

export default class MonkeyWriter extends Component {
    static propTypes = {
        sourceText: PropTypes.string,
        textLength: PropTypes.number,
        level: PropTypes.number,
    }

    static defaultProps = {
        ...setters[0].params,
    }

    state = {
        ...this.props,
        monkeyText: '',
    }

    componentWillMount () {
        this.calculateFrequencies()
        this.generateText()
    }

    frequencies = {}
    lastChars = []

    // todo можно сделать чистой, установку стейта и колбэк вынести в маунт
    calculateFrequencies = () => {
        const text = this.state.sourceText.split('')
        const lastChars = text.splice(0, this.state.level - 1)

        const frequencies = _.reduce(text, (f, char) => {
            lastChars.push(char)
            const frequency = _.get(f, lastChars)

            _.setWith(f, lastChars, _.isUndefined(frequency) ? 1 : frequency + 1, Object)

            lastChars.shift()
            return f
        }, {})

        this.frequencies = frequencies
    }

    // todo сделать функцию чистой
    generateChar = () => {
        const frequencies = _.isEmpty(this.lastChars)
            ? this.frequencies
            : _.get(this.frequencies, this.lastChars)
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
        this.calculateFrequencies()

        const text = []
        this.lastChars = this.state.sourceText
            .substr(Math.floor(Math.random() * (this.state.sourceText.length - this.state.level)), this.state.level - 1)
            .split('')

        for (let i = 0; i <= this.state.textLength; i += 1) {
            text.push(this.generateChar())
        }

        this.setState({ monkeyText: text.join('') })
    }

    changeHandler = (name, initialValue) => {
        let value = initialValue

        switch (name) {
            case IDS.level:
                value = parseInt(value, 10)
                break
            default:
        }

        this.setState({ [name]: value })
    }

    selectAll = (control) => control.setSelectionRange(0, control.value.length)

    render () {
        // todo сделать нормальные стили элементов
        return (
            <div>
                <SettersBlock
                    setters={setters}
                    setHandler={this.changeHandler}
                    key="setters"
                />
                <Connector
                    state={this.state}
                    onChange={this.changeHandler}
                    onFocus={this.selectAll}
                    className="state-control-input"
                    key="connector"
                >
                    <Input
                        id={IDS.level}
                        label="Analyzing level"
                        defaultNum={1}
                    />
                    <Input
                        id={IDS.sourceText}
                        label="Source text"
                        multiLine
                    />
                    <Input
                        id={IDS.textLength}
                        label="Length of generation"
                        defaultNum={1}
                    />
                </Connector>
                <button onClick={this.generateText}>Regenerate</button>
                <p><strong>Generated text:</strong></p>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.monkeyText}</pre>
            </div>
        )
    }
}
