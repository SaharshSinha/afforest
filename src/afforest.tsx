
'use client';
'use strict';

import React from "react";
import { createRef, RefObject } from "react";

export class ForestNode<TItem, TProps = void> {
  item!: TItem;
  depth!: number;
  treeLocationIndex!: number[];
  localLocationIndex!: number;
  divRef!: RefObject<HTMLDivElement>;
  update!: (changedItem: TItem, idxs?: number[]) => void; //update
  delete!: (idxs?: number[]) => void; //delete
  insertChild!: (newItem: TItem, idx?: number, idxs?: number[]) => void; //insertChild
  renderSubTrees!: (props: TProps) => React.JSX.Element;
  parentProps!: TProps | undefined;
  parentNode?: ForestNode<TItem, TProps>;
}

export default function Forest<TItem, TProps = void>(props: { 
    trees: Array<TItem>,
    getSubTreesCallback: (node: TItem) => TItem[],
    setSubTreesCallback?: (node: TItem, trees: TItem[]) => void,
    onTreesChange?: (newTree: Array<TItem>) => void,
    renderItem: (propsInternal: ForestNode<TItem, TProps>) => React.JSX.Element,
}) {

  return <ForestNodeInternal 
    idxs={[]}
    getSubTreesCallback={props.getSubTreesCallback}
    setSubTreesCallback={props.setSubTreesCallback}
    trees={props.trees} 
    renderItem={props.renderItem}
    changeItemCallback={changeItem}
    deleteItemCallback={deleteItem}
    insertItemCallback={insertItem}
    locateItemCallback={locateItem}
    parentNode={undefined}
  />;

  function changeItem(changedItem: TItem, idxs?: number[]) {
    const newTrees = changeItemInTree(props.trees, changedItem, idxs??[], props.getSubTreesCallback);
    props.onTreesChange && props.onTreesChange(newTrees);
  }

  function deleteItem(idxs?: number[]) {
    const newTrees = deleteItemInTree(props.trees, props.getSubTreesCallback, idxs??[]);
    props.onTreesChange && props.onTreesChange(newTrees);
  }

  function locateItem(idxs?: number[]): number[] {
    return idxs || [];
  }

  function insertItem(newItem: TItem, idx?: number, idxs?: number[]): void {
    if (!props.setSubTreesCallback) {
      throw new Error('setSubTreesCallback is required for insertItem');
    }
    const newTrees = insertItemInTree(props.trees, props.getSubTreesCallback, props.setSubTreesCallback, newItem, idxs??[], idx);
    props.onTreesChange && props.onTreesChange(newTrees);
  }
}

function ForestNodeInternal<TNode, TProps = void>(props: { 
  idxs: number[],
  trees: Array<TNode>,
  getSubTreesCallback: (node: TNode) => TNode[],
  setSubTreesCallback?: (node: TNode, tree: TNode[]) => void,
  renderItem: (props: ForestNode<TNode, TProps>) => React.JSX.Element,
  changeItemCallback: (changedItem: TNode, idxs?: number[]) => void,
  deleteItemCallback: (idxs?: number[]) => void,
  insertItemCallback: (newItem: TNode, idx?: number, idxs?: number[]) => void,
  locateItemCallback: (idxs?: number[]) => number[],
  parentProps?: TProps,
  parentNode?: ForestNode<TNode, TProps>
}) {
return (props.trees.map((item, mapIndex) => {
  const thisItemsLocationIndex = props.idxs.concat(mapIndex);
  const divRef = createRef<HTMLDivElement>();
  return (
    <div 
      ref={divRef}
      key={mapIndex}>
      {props.renderItem({
        item: item,
        parentProps: props.parentProps,
        parentNode: props.parentNode,
        depth: thisItemsLocationIndex.length,
        treeLocationIndex: thisItemsLocationIndex,
        localLocationIndex: mapIndex,
        divRef: divRef,
        update: (changedItem: TNode, idxs?: number[]) => props.changeItemCallback(changedItem, thisItemsLocationIndex),
        delete: (idxs?: number[]) => props.deleteItemCallback(thisItemsLocationIndex),
        insertChild: (newItem: TNode, idx?: number, idxs?: number[]) => props.insertItemCallback(newItem, idx, thisItemsLocationIndex),
        renderSubTrees: (parentProps: TProps) => <ForestNodeInternal
          parentProps={parentProps}
          parentNode={{
            item: item,
            parentProps: props.parentProps,
            parentNode: props.parentNode,
            depth: thisItemsLocationIndex.length,
            treeLocationIndex: thisItemsLocationIndex,
            localLocationIndex: mapIndex,
            divRef: divRef,
            update: (changedItem: TNode, idxs?: number[]) => props.changeItemCallback(changedItem, thisItemsLocationIndex),
            delete: (idxs?: number[]) => props.deleteItemCallback(thisItemsLocationIndex),
            insertChild: (newItem: TNode, idx?: number, idxs?: number[]) => props.insertItemCallback(newItem, idx, thisItemsLocationIndex),
            renderSubTrees: () => <></>,}}
          getSubTreesCallback={props.getSubTreesCallback}
          setSubTreesCallback={props.setSubTreesCallback}
          idxs={thisItemsLocationIndex}
          trees={props.getSubTreesCallback(item)}
          renderItem={props.renderItem}
          changeItemCallback={props.changeItemCallback}
          deleteItemCallback={props.deleteItemCallback}
          insertItemCallback={props.insertItemCallback}
          locateItemCallback={props.locateItemCallback} />
      })}
    </div>
  );
}));
}

export function changeItemInTree<T>(
  trees: T[], 
  changedItem: T, 
  idxs: number[],
  getSubTreesCallback: (node: T) => T[]
): T[] {
  const newTrees = [...trees];
  if (idxs) {
    if (idxs.length === 1) {
      newTrees.splice(idxs[0], 1, changedItem);
      return newTrees;
    }
    let targetNode: T = newTrees[idxs[0]];
    let i;
    for (i = 1; i < idxs.length - 1; i++) {
      const subTrees = getSubTreesCallback(targetNode);
      if (targetNode && subTrees) {
        targetNode = subTrees[idxs[i]];
      } else {
        break;
      }
    }
    if (targetNode) {
      getSubTreesCallback(targetNode).splice(idxs[idxs.length - 1], 1, changedItem);
    }
  }
  return newTrees;
}

export function deleteItemInTree<T>(
  trees: T[], 
  getSubTreesCallback: (node: T) => T[],
  idxs: number[]): T[] {
  let newTrees = [...trees];
  if (idxs) {
    if (idxs.length === 1) {
      newTrees.splice(idxs[0], 1);
      return newTrees;
    }
    let parentNode = newTrees[idxs[0]];
    for (let i = 1; i < idxs.length - 1; i++) {
      if (parentNode && getSubTreesCallback(parentNode)) {
        parentNode = getSubTreesCallback(parentNode)[idxs[i]];
      } else {
        break;
      }
    }
    if (parentNode) {
      if (getSubTreesCallback(parentNode)) {
        getSubTreesCallback(parentNode).splice(idxs[idxs.length - 1], 1);
      } else {
        newTrees.splice(idxs[0], 1);
      }
    }
  }
  return newTrees;
}


export function insertItemInTree<T>(
  trees: T[], 
  getSubTreesCallback: (node: T) => T[],
  setSubTreesCallback: (node: T, tree: T[]) => void,
  newItem: T, 
  idxs: number[], 
  idx?: number): T[] {
  const newTrees = [...trees];
  if (idxs && idxs.length === 0) {
    newTrees.push(newItem);
  } else if (idxs && idxs.length === 1) {
    setSubTreesCallback(newTrees[idxs[0]], getSubTreesCallback(newTrees[idxs[0]]) || []);
    getSubTreesCallback(newTrees[idxs[0]])?.splice(idx??0, 0, newItem );
  } else if (idxs) {
    let targetNode = newTrees[idxs[0]];
    let i = 0;
    for (i = 1; i < idxs.length; i++) {
      if (targetNode && getSubTreesCallback(targetNode)) {
        targetNode = getSubTreesCallback(targetNode)[idxs[i]];
      } else {
        break;
      }
    }
    const existingSubTrees = getSubTreesCallback(targetNode);
    if (targetNode && getSubTreesCallback(targetNode)) {
      existingSubTrees.splice(idx??0, 0, newItem );
      setSubTreesCallback(targetNode, existingSubTrees);
    }
  }
  return newTrees;
}
