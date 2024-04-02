import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  CubeCamera,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import "./style.css";
import { Boxes } from "./Boxes";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { FloatingGrid } from "./FloatingGrid";
import { Rings } from "./Rings";

function CarShow() {
  return (
    <>
      <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />
      {/* 透視相機 */}
      <PerspectiveCamera makeDefault fov={50} position={[3, 4, 5]} />

      <color args={[0, 0, 0]} attach="background" />

      {/* CubeCamera立方體相機: 捕捉场景的立方体贴图，然后将这个立方体贴图应用到环境中的反射和折射效果上*/}
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Car />
          </>
        )}
      </CubeCamera>
      <Rings />
      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        color={[0.14, 0.5, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <Ground />
      <FloatingGrid />
      <Boxes />

      <EffectComposer>
        {/* DepthOfField:用于实现“景深”效果 */}
        {/* <DepthOfField focusDistance={0.0035} focalLength={0.01} bokehScale={3} height={480} /> */}
        {/* Bloom:用于实现“泛光”效果 */}
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={1.3} // 设置泛光的强度
          width={300} //设置了泛光渲染的宽度。
          height={300} // 设置了泛光渲染的高度。
          kernelSize={5} // 指定了模糊核的大小。
          luminanceThreshold={0.15} // 亮度阈值。提高此值可遮盖场景中较暗的元素。
          luminanceSmoothing={0.025} // 亮度阈值的平滑度。范围为 [0, 1]。
        />
        {/* ChromaticAberration: 用于实现“色差”效果 */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // 指定了混合模式
          offset={[0.0005, 0.0012]} // 色差的颜色偏移
        />
      </EffectComposer>
    </>
  );
}

function App() {
  return (
    <Suspense>
      <Canvas shadows>
        <CarShow />
      </Canvas>
    </Suspense>
  );
}

export default App;
