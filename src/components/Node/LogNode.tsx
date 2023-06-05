import { Button, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import NodeHandle from './NodeHandle'

export interface LogNodeProps {
  id: string
}

function LogNode({ id }: LogNodeProps) {
  //   useEffect(() => {
  //     console.log(value)
  //   }, [value])

  return (
    <>
      <CardHeader title='Log' sx={{minWidth: '120px', textAlign: 'center', backgroundColor: 'coral'}}/>
      <Divider />
      <CardContent>
        <Stack display='flex' alignItems='center' direction='row'>
          <Typography>In</Typography>
          <NodeHandle nodeId={id} index={0} type='target'/>
        </Stack>
      </CardContent>
    </>
  )
}

export default LogNode
