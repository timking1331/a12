import React, { useState } from 'react';
import './App3D.css';
import { Game, GameState } from '../../model/Game';
import { Canvas } from '@react-three/fiber';
import Board from './Board';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Die from './Die';
import Player from './Player';
import { DoubleSide, Vector3 } from 'three';

function App3D() {

  const [gameObj, setGameObj] = useState<Game>(new Game())
  const [game, setGame] = useState<GameState>(gameObj.getState())

  function rollHandler() {
    gameObj.rollHandler()
    setGame(prevState => ({
      ...prevState,
      ...gameObj.getState(),
    }))
  }

  function bankHandler() {
    gameObj.bankHandler()
    setGame(prevState => ({
      ...prevState,
      ...gameObj.getState(),
    }))
  }

  function tileHandler(tileId: number) {
    gameObj.tileHandler(tileId)
    setGame(prevState => ({
      ...prevState,
      ...gameObj.getState(),
    }))
  }

  const layouts = [
    {
      diceQueuingDimension: 0,
      dicePositions: [0, 0, -7],
      boardPositions: [0, 0, 0],
      player1Positions: [-5, 0, 5],
      player2Positions: [5, 0, 5],
    },
    {
      diceQueuingDimension: 2,
      dicePositions: [10, 0, 0],
      boardPositions: [0, 0, 0],
      player1Positions: [-5, 0, -4],
      player2Positions: [5, 0, -4],
    },
  ]

  const currentLayout = layouts[1]

  const diceComponents = game.dice.map((die, index) => {
    const offset = -3 + index * 2
    const position = [0, 1, 0]
    position[currentLayout.diceQueuingDimension] = offset

    return <Die
      key={index}
      sides={die}
      onClick={rollHandler}
      position={position as unknown as Vector3}
      castShadow
    >
    </Die>
  })

  const status = game.canRoll
    ? `ROLL PLAYER ${game.currentPlayer}`
    : game.canMove
      ? `MOVE PLAYER ${game.currentPlayer} BY ${gameObj.getSteps()}`
      : `I DONT KNOW?!?! PLAYER ${game.currentPlayer}`

  return (
    <div className="App3D">
      <Canvas 
        camera={{ zoom: 50, position: [-10, 10, -10] }} orthographic 
        // camera={{ position: [-10, 10, -10] }}
        shadows >
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={1} />
        <pointLight position={[0, 7, -6]} decay={1} intensity={15} castShadow />
        {/* <directionalLight position={[0, 7, 0]} castShadow /> */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial color="lightgrey" />
        </mesh>

        <group position={currentLayout.dicePositions as unknown as Vector3}>
          {diceComponents}
        </group>
        <Board position={currentLayout.boardPositions as unknown as Vector3} tiles={game.board} tileHandler={tileHandler} castShadow></Board>
        <Player position={currentLayout.player1Positions as unknown as Vector3} bankHandler={bankHandler} name={game.player1.name} color={game.player1.color} stonesCount={game.player1.stonesCount}></Player>
        <Player position={currentLayout.player2Positions as unknown as Vector3} bankHandler={bankHandler} name={game.player2.name} color={game.player2.color} stonesCount={game.player2.stonesCount}></Player>

        {/* <OrbitControls /> */}
      </Canvas>
      <span style={{
        position: 'fixed',
        top: 50,
        left: 0,
        width: '100vw',
        textAlign: 'center',
        fontSize: 50,
        color: 'white',
      }}>{status}</span>
    </div>
  );
}
useGLTF.preload('/ur-no-bump-tint.glb')

export default App3D;