import React from "react";
import { RefObject } from "react";
export declare class ForestNode<TItem, TProps = void> {
    item: TItem;
    depth: number;
    treeLocationIndex: number[];
    localLocationIndex: number;
    divRef: RefObject<HTMLDivElement>;
    update: (changedItem: TItem, idxs?: number[]) => void;
    delete: (idxs?: number[]) => void;
    insertChild: (newItem: TItem, idx?: number, idxs?: number[]) => void;
    renderSubTrees: (props: TProps) => React.JSX.Element;
    parentProps: TProps | undefined;
    parentNode?: ForestNode<TItem, TProps>;
}
export default function Forest<TItem, TProps = void>(props: {
    trees: Array<TItem>;
    getSubTreesCallback: (node: TItem) => TItem[];
    setSubTreesCallback?: (node: TItem, trees: TItem[]) => void;
    onTreesChange?: (newTree: Array<TItem>) => void;
    renderItem: (propsInternal: ForestNode<TItem, TProps>) => React.JSX.Element;
}): React.JSX.Element;
export declare function changeItemInTree<T>(trees: T[], changedItem: T, idxs: number[], getSubTreesCallback: (node: T) => T[]): T[];
export declare function deleteItemInTree<T>(trees: T[], getSubTreesCallback: (node: T) => T[], idxs: number[]): T[];
export declare function insertItemInTree<T>(trees: T[], getSubTreesCallback: (node: T) => T[], setSubTreesCallback: (node: T, tree: T[]) => void, newItem: T, idxs: number[], idx?: number): T[];
