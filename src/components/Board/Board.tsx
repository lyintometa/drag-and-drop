import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Node from '../Node/Node'

interface Props { }

function Board(props: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)


    useEffect(() => {
        var canvas = canvasRef.current
        var context = canvas?.getContext('2d')
        if (!context) return
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width /2, context.canvas.height/2)
    }, [])


    return (
        <Box sx={{ display: 'flex', height: '100vh', widht: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <canvas ref={canvasRef} style={{ height: '90%', width: '90%', backgroundColor: 'lightgrey', border: '4px solid black' }} >





            </canvas>{/* <Node>Test</Node> */}
        </Box>
    )
}

export default Board
