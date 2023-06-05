import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { changeConstantValue, selectConstantNodeValue } from '../../redux/modules/constantNodes'
import { Button, CardContent, CardHeader, Divider, Stack, TextField, Typography } from '@mui/material'
import NodeHandle from './NodeHandle'

export interface ConstantNodeProps {
  id: string
}

function ConstantNode({ id }: ConstantNodeProps) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(selectConstantNodeValue(id))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeConstantValue({ id, value: e.target.value }))
  }

  const handleDragStart = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <CardHeader sx={{ textAlign: 'center', backgroundColor: 'lightblue' }} title={'Constant'}/>
      <Divider />
      <CardContent>
        <Stack display='flex' alignItems='center' direction='row'>
          <TextField
            placeholder='Value'
            value={value}
            onChange={handleChange}
            onDragStart={handleDragStart}
            draggable
          />
          <NodeHandle nodeId={id} index={0} type='source' />
        </Stack>
      </CardContent>
    </>
  )
}

export default ConstantNode
