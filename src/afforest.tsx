/**
 * Renders a forest component.
 *
 * @template T - The type of the items in the forest.
 * @param {Object} props - The props for the forest component.
 * @param {Array<T>} props.trees - The array of trees to render.
 * @param {(node: T) => T[]} props.getSubTreesCallback - The callback function to get the sub-trees of a node.
 * @param {(node: T, trees: T[]) => void} [props.setSubTreesCallback] - The optional callback function to set the sub-trees of a node.
 * @param {(newTree: Array<T>) => void} [props.onTreesChange] - The optional callback function to handle tree changes.
 * @param {(props: { item: T, depth: number, locationIndex: number[], divRef: RefObject<HTMLDivElement>, changeItem: (changedItem: T, idxs?: number[]) => void, deleteItem: (idxs?: number[]) => void, insertItem: (newItem: T, idx?: number, idxs?: number[]) => void, locateItem: () => number[], subTrees: React.JSX.Element }) => React.JSX.Element} props.renderItem - The function to render each item in the forest.
 */
'use client';

import React from "react";
import { createRef, RefObject } from "react";


export default function Forest<T>(props: { 
    trees: Array<T>,
    getSubTreesCallback: (node: T) => T[],
    setSubTreesCallback?: (node: T, trees: T[]) => void,
    onTreesChange?: (newTree: Array<T>) => void,
    renderItem: (props: { 
      item: T, 
      depth: number,
      locationIndex: number[],
      divRef: RefObject<HTMLDivElement>,
      changeItem: (changedItem: T, idxs?: number[]) => void,
      deleteItem: (idxs?: number[]) => void,
      insertItem: (newItem: T, idx?: number, idxs?: number[]) => void,
      locateItem: () => number[],
      subTrees: React.JSX.Element,
    }) => React.JSX.Element,
}) {

  return <AfforestInternal 
    idxs={[]}
    getSubTreesCallback={props.getSubTreesCallback}
    setSubTreesCallback={props.setSubTreesCallback}
    trees={props.trees} 
    renderItem={props.renderItem}
    changeItemCallback={changeItem}
    deleteItemCallback={deleteItem}
    insertItemCallback={insertItem}
    locateItemCallback={locateItem}
  />;

  function changeItem(changedItem: T, idxs?: number[]) {
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

  function insertItem(newItem: T, idx?: number, idxs?: number[]): void {
    if (!props.setSubTreesCallback) {
      throw new Error('setSubTreesCallback is required for insertItem');
    }
    const newTrees = insertItemInTree(props.trees, props.getSubTreesCallback, props.setSubTreesCallback, newItem, idxs??[], idx);
    props.onTreesChange && props.onTreesChange(newTrees);
  }
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

function AfforestInternal<T>(props: { 
    idxs: number[],
    trees: Array<T>,
    getSubTreesCallback: (node: T) => T[],
    setSubTreesCallback?: (node: T, tree: T[]) => void,
    renderItem: (props: { 
      item: T, 
      depth: number,
      locationIndex: number[],
      divRef: RefObject<HTMLDivElement>,
      changeItem: (changedItem: T, idxs?: number[]) => void,
      deleteItem: (idxs?: number[]) => void,
      insertItem: (newItem: T, idx?: number, idxs?: number[]) => void,
      locateItem: () => number[],
      subTrees: React.JSX.Element,
    }) => React.JSX.Element,
    changeItemCallback: (changedItem: T, idxs?: number[]) => void,
    deleteItemCallback: (idxs?: number[]) => void,
    insertItemCallback: (newItem: T, idx?: number, idxs?: number[]) => void,
    locateItemCallback: (idxs?: number[]) => number[],
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
          depth: thisItemsLocationIndex.length,
          locationIndex: thisItemsLocationIndex,
          divRef: divRef,
          changeItem: (changedItem: T, idxs?: number[]) => props.changeItemCallback(changedItem, thisItemsLocationIndex),
          deleteItem: (idxs?: number[]) => props.deleteItemCallback(thisItemsLocationIndex),
          insertItem: (newItem: T, idx?: number, idxs?: number[]) => props.insertItemCallback(newItem, idx, thisItemsLocationIndex),
          locateItem: (idxs?: number[]) => props.locateItemCallback(thisItemsLocationIndex),
          subTrees: <AfforestInternal
            getSubTreesCallback={props.getSubTreesCallback}
            setSubTreesCallback={props.setSubTreesCallback} 
            idxs={thisItemsLocationIndex}
            trees={props.getSubTreesCallback(item)} 
            renderItem={props.renderItem} 
            changeItemCallback={props.changeItemCallback}
            deleteItemCallback={props.deleteItemCallback}
            insertItemCallback={props.insertItemCallback}
            locateItemCallback={props.locateItemCallback}
          />
        })}
      </div>
    );
  }));
}