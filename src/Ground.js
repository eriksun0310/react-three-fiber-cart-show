import React, { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { LinearEncoding, RepeatWrapping, TextureLoader } from "three";

export function Ground() {
  const [roughness, normal] = useLoader(TextureLoader, [
    process.env.PUBLIC_URL + "textures/terrain-roughness.jpg",
    process.env.PUBLIC_URL + "textures/terrain-normal.jpg",
  ]);

  useEffect(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(5, 5);
      t.offset.set(0, 0);
    });

    normal.encoding = LinearEncoding;
  }, [normal, roughness]);

  //useFrame:每一幀渲染時會執行的操作 (state:当前的渲染状态, delta:当前帧与上一帧之间的时间间隔)
  useFrame((state, delta) => {
    let t = -state.clock.getElapsedTime() * 0.128;
    // 偏移植會根據時間而變化, 達到動態效果
    roughness.offset.set(0, t % 1); 
    normal.offset.set(0, t % 1);
  });

  return (
    <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        envMapIntensity={0}
        normalMap={normal}
        normalScale={[0.15, 0.15]}
        roughnessMap={roughness}
        dithering={true}
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[1000, 400]}  // 模糊地面反射（寬度、高度），0 為跳過模糊
        mixBlur={30}  // 模糊和表面粗糙度混合的程度（默認 = 1）
        mixStrength={80} //反射強度
        mixContrast={1} // 反射對比度
        resolution={1024} //Off-buffer 解析度，越低=越快，越高=更好的質量，更慢
        mirror={0} // 鏡像環境，0 = 紋理顏色，1 = 選擇環境顏色
        depthScale={0.01} // 深度因素的比例（0 = 無深度，默認 = 0）
        minDepthThreshold={0.9} // 深度紋理插值的下限（默認 = 0）
        maxDepthThreshold={1} // 深度紋理插值的上限（默認 = 0）
        depthToBlurRatioBias={0.25} // 在計算模糊量之前對深度紋理添加偏差因子[模糊因子=模糊紋理*（深度紋理+偏差）]。它接受介於 0 和 1 之間的值，默認值為 0.25。偏差量 > 0 確保模糊紋理不會因為與深度紋理的乘法而太尖銳
        debug={0}
        reflectorOffset={0.2} // 偏移投射反射的虛擬相機。當反射表面距離物體原點一定距離時很有用
      />
    </mesh>
  );
}
