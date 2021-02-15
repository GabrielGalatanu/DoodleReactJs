import React, { useState } from 'react'
import { Donut } from 'react-dial-knob'

export default function Knob(props) { 
    return <Donut
        diameter={150}
        min={0}
        max={props.maxValue}
        step={1}
        value={props.currentValue}
        theme={{
            donutColor: 'blue'
        }}
        onValueChange={(event) => props.onChange(event)}
        ariaLabelledBy={'my-label'}
    >
        <label id={'my-label'}>{props.textLabel}</label>
    </Donut>
}