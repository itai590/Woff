import React, { useMemo, Suspense, useState } from 'react';
import {each} from 'lodash';
import Spinner from './Spinner';
import { auth } from '../firebase';
import expr from 'expression-eval';

export default function Generic({ match, path, snapshot, style, def, disableLoading }) {

    const data = snapshot.data();

    def = def || data.root;

    if (!def) {
        return <Projection 
            disableLoading={disableLoading}
            path={path} 
            style={style}
            match={match}
            snapshot={snapshot} 
            props={data}/>
    }

    if (!Array.isArray(def)) {
        def = [def];
    }

    return def.map((props, key) => <Projection {...{
        disableLoading,
        key,
        path,
        match,
        style,
        snapshot,
        props,
    }}/>);
}

function evaluate(context, expression) {
    const ast = expr.parse(expression);
    try {
        return expr.eval(ast, context);
    } 
    catch(err) {
        console.error(err);
        return;
    }
}

export function parseProps(props, context) {
    const newProps = {};

    context = {
        user: {
            ...auth.currentUser,
            ...auth.currentUser && auth.currentUser.isAnonymous && {
                displayName: localStorage.getItem("anonDisplayName")
            }
        },
        ...context,
    }

    each(props, (value, key) => {
        const res = { key, value };
        if (key.charAt(0) === '$') {
            res.key = key.substring(1);
        } else {
            res.value = (() => {
                if (typeof value == 'string') {
                    if (value.match(/^\${.*}$/) && value.substring(2).indexOf('$') === -1) {
                        return evaluate(context, value.match(/\${(.*)}/)[1]);
                    }
                    return value.replace(/\${([^}]*)}/g, (_, expression) => evaluate(context, expression));
                } if (typeof value == 'function') {
                    return () => value(context);
                } else if (key !== 'children' && Array.isArray(value)) {
                    return value.map(v => parseProps(v, context));
                } else if (typeof value == 'object' && !Array.isArray(value)) {
                    return parseProps(value, context);
                } else {
                    return value;
                }
            })();
        }
        newProps[res.key] = res.value;
    });
    return newProps;
}

function Projection({ match, path, snapshot, style, props, disableLoading }) {

    const [loadingError, setLoadingError] = useState();

    const {type} = props;

    const data = snapshot.data();

    const context = {
        data,
        snapshot,
        match,
    };

    const LoadableComponent = useMemo(() => React.lazy(() => {
        if (type) {
            return import('./' + snakeToCamel(type)).catch(err => {
                console.error(err);
                setLoadingError(err);
            });
        }
    }), [type]);

    if (!type) {
        return <div {...props}/>;
    }

    return <Suspense fallback={loadingError ? loadingError.message : (!disableLoading && <Spinner/>)}>
        <LoadableComponent 
            match={match} 
            style={style}
            path={path} 
            snapshot={snapshot} 
            {...parseProps(props, context)}/>
    </Suspense>
}

function snakeToCamel(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(.)/g, (a, b) => `${b.toUpperCase()}`)
}

export function getCollection(snapshot, path) {
    let ref = snapshot.ref;
    while (path.startsWith("../")) {
        path = path.replace(/^\.\.\//, '')
        ref = ref.parent;
    }
    return ref.collection(path);
}