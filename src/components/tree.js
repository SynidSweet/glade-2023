import React from 'react'
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { MeshStandardMaterial, ShapeGeometry } from 'three';

const treeMaterial = new MeshStandardMaterial({
    color: 0x5e594a,
})

const trees = [
    {
        file: './trees/tree1.svg',
        position: [-27, 34, -4.6],
        scale: [0.04, -0.04, 0.04],
        geometry: []
    },
    {
        file: './trees/tree2.svg',
        position: [-14, 34, -5.6],
        scale: [0.04, -0.04, 0.04],
        geometry: []
    },
    {
        file: './trees/tree3.svg',
        position: [-18, 7, -0.6],
        scale: [0.03, -0.03, 0.03],
        geometry: []
    },
    {
        file: './trees/tree4.svg',
        position: [40, 29, -1.4],
        scale: [-0.03, -0.03, 0.03],
        geometry: []
    },
]

const loader = new SVGLoader();

trees.forEach((tree) => {
    loader.load(tree.file,
    function ( data ) {
        const paths = data.paths;

        for ( let i = 0; i < paths.length; i ++ ) {

            const path = paths[ i ];
            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {
                const shape = shapes[ j ];
                const geometry = new ShapeGeometry( shape );
                
                tree.geometry.push( geometry );
            }
        }
    }
    );
});


const TreePlane = (props) => {

    const tree = trees[props.index]

    return (
        <group position={tree.position} scale={tree.scale}>
            {tree.geometry.map((geometry, i) => {
                return <mesh key={i} geometry={geometry} material={treeMaterial} />
            })}
        </group>
    )
}

export default TreePlane