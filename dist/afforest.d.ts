import React from "react";
import { RefObject } from "react";
export default function Forest<T>(props: {
    trees: Array<T>;
    getSubTreesCallback: (node: T) => T[];
    setSubTreesCallback?: (node: T, trees: T[]) => void;
    onTreesChange?: (newTree: Array<T>) => void;
    renderItem: (props: {
        item: T;
        depth: number;
        locationIndex: number[];
        divRef: RefObject<HTMLDivElement>;
        changeItem: (changedItem: T, idxs?: number[]) => void;
        deleteItem: (idxs?: number[]) => void;
        insertItem: (newItem: T, idx?: number, idxs?: number[]) => void;
        locateItem: () => number[];
        subTrees: React.JSX.Element;
    }) => React.JSX.Element;
}): React.JSX.Element;
export declare function changeItemInTree<T>(trees: T[], changedItem: T, idxs: number[], getSubTreesCallback: (node: T) => T[]): T[];
export declare function deleteItemInTree<T>(trees: T[], getSubTreesCallback: (node: T) => T[], idxs: number[]): T[];
export declare function insertItemInTree<T>(trees: T[], getSubTreesCallback: (node: T) => T[], setSubTreesCallback: (node: T, tree: T[]) => void, newItem: T, idxs: number[], idx?: number): T[];
