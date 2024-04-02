import React, { useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export function Car() {
  //加載3D模型
  const gltf = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "models/car/scene.gltf"
  );

  useEffect(() => {
    gltf.scene.scale.set(0.005, 0.005, 0.005); // 缩小到原始大小的 0.5%
    gltf.scene.position.set(0, -0.035, 0);
    //traverse:遍歷模型的所有子對象
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);


  // 使輪胎滾動
  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime();

    let group = gltf.scene.children[0].children[0].children[0];
    group.children[0].rotation.x = t * 2;
    group.children[2].rotation.x = t * 2;
    group.children[4].rotation.x = t * 2;
    group.children[6].rotation.x = t * 2;
  });

  //primitive 佔位符:對於gltf 格式可以直接使用
  return <primitive object={gltf.scene} />;
}
