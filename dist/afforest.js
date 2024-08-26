"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Forest;
exports.changeItemInTree = changeItemInTree;
exports.deleteItemInTree = deleteItemInTree;
exports.insertItemInTree = insertItemInTree;
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
function Forest(props) {
    return react_1.default.createElement(AfforestInternal, { idxs: [], getSubTreesCallback: props.getSubTreesCallback, setSubTreesCallback: props.setSubTreesCallback, trees: props.trees, renderItem: props.renderItem, changeItemCallback: changeItem, deleteItemCallback: deleteItem, insertItemCallback: insertItem, locateItemCallback: locateItem });
    function changeItem(changedItem, idxs) {
        const newTrees = changeItemInTree(props.trees, changedItem, idxs !== null && idxs !== void 0 ? idxs : [], props.getSubTreesCallback);
        props.onTreesChange && props.onTreesChange(newTrees);
    }
    function deleteItem(idxs) {
        const newTrees = deleteItemInTree(props.trees, props.getSubTreesCallback, idxs !== null && idxs !== void 0 ? idxs : []);
        props.onTreesChange && props.onTreesChange(newTrees);
    }
    function locateItem(idxs) {
        return idxs || [];
    }
    function insertItem(newItem, idx, idxs) {
        if (!props.setSubTreesCallback) {
            throw new Error('setSubTreesCallback is required for insertItem');
        }
        const newTrees = insertItemInTree(props.trees, props.getSubTreesCallback, props.setSubTreesCallback, newItem, idxs !== null && idxs !== void 0 ? idxs : [], idx);
        props.onTreesChange && props.onTreesChange(newTrees);
    }
}
function changeItemInTree(trees, changedItem, idxs, getSubTreesCallback) {
    const newTrees = [...trees];
    if (idxs) {
        if (idxs.length === 1) {
            newTrees.splice(idxs[0], 1, changedItem);
            return newTrees;
        }
        let targetNode = newTrees[idxs[0]];
        let i;
        for (i = 1; i < idxs.length - 1; i++) {
            const subTrees = getSubTreesCallback(targetNode);
            if (targetNode && subTrees) {
                targetNode = subTrees[idxs[i]];
            }
            else {
                break;
            }
        }
        if (targetNode) {
            getSubTreesCallback(targetNode).splice(idxs[idxs.length - 1], 1, changedItem);
        }
    }
    return newTrees;
}
function deleteItemInTree(trees, getSubTreesCallback, idxs) {
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
            }
            else {
                break;
            }
        }
        if (parentNode) {
            if (getSubTreesCallback(parentNode)) {
                getSubTreesCallback(parentNode).splice(idxs[idxs.length - 1], 1);
            }
            else {
                newTrees.splice(idxs[0], 1);
            }
        }
    }
    return newTrees;
}
function insertItemInTree(trees, getSubTreesCallback, setSubTreesCallback, newItem, idxs, idx) {
    var _a;
    const newTrees = [...trees];
    if (idxs && idxs.length === 0) {
        newTrees.push(newItem);
    }
    else if (idxs && idxs.length === 1) {
        setSubTreesCallback(newTrees[idxs[0]], getSubTreesCallback(newTrees[idxs[0]]) || []);
        (_a = getSubTreesCallback(newTrees[idxs[0]])) === null || _a === void 0 ? void 0 : _a.splice(idx !== null && idx !== void 0 ? idx : 0, 0, newItem);
    }
    else if (idxs) {
        let targetNode = newTrees[idxs[0]];
        let i = 0;
        for (i = 1; i < idxs.length; i++) {
            if (targetNode && getSubTreesCallback(targetNode)) {
                targetNode = getSubTreesCallback(targetNode)[idxs[i]];
            }
            else {
                break;
            }
        }
        const existingSubTrees = getSubTreesCallback(targetNode);
        if (targetNode && getSubTreesCallback(targetNode)) {
            existingSubTrees.splice(idx !== null && idx !== void 0 ? idx : 0, 0, newItem);
            setSubTreesCallback(targetNode, existingSubTrees);
        }
    }
    return newTrees;
}
function AfforestInternal(props) {
    return (props.trees.map((item, mapIndex) => {
        const thisItemsLocationIndex = props.idxs.concat(mapIndex);
        const divRef = (0, react_2.createRef)();
        return (react_1.default.createElement("div", { ref: divRef, key: mapIndex }, props.renderItem({
            item: item,
            depth: thisItemsLocationIndex.length,
            locationIndex: thisItemsLocationIndex,
            divRef: divRef,
            changeItem: (changedItem, idxs) => props.changeItemCallback(changedItem, thisItemsLocationIndex),
            deleteItem: (idxs) => props.deleteItemCallback(thisItemsLocationIndex),
            insertItem: (newItem, idx, idxs) => props.insertItemCallback(newItem, idx, thisItemsLocationIndex),
            locateItem: (idxs) => props.locateItemCallback(thisItemsLocationIndex),
            subTrees: react_1.default.createElement(AfforestInternal, { getSubTreesCallback: props.getSubTreesCallback, setSubTreesCallback: props.setSubTreesCallback, idxs: thisItemsLocationIndex, trees: props.getSubTreesCallback(item), renderItem: props.renderItem, changeItemCallback: props.changeItemCallback, deleteItemCallback: props.deleteItemCallback, insertItemCallback: props.insertItemCallback, locateItemCallback: props.locateItemCallback })
        })));
    }));
}
