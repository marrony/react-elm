# react-elm
### Elm reactive programming model for ReactJS

The goal of this library is to imitate architecture used in Elm programming language where you break your application in three parts (update, model, view). 

This is a simple Counter component.

`Counter.js`

```javascript
import React from 'react'
import { Address, Action } from 'react-elm'

export function view(props) {
  return (
    <div>
      <button onClick={ (e) => Address.send(props.address, new Action("INC")) }>Inc</button>
      <span>{props.model}</span>
      <button onClick={ (e) => Address.send(props.address, new Action("DEC")) }>Dec</button>
    </div>
  );
}

export function update(action, model) {
  switch(action.type) {
    case "INC":
      return model + 1;
    case "DEC":
      return model - 1;
  }

  return model;
}
```

`index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'react-elm'
import * as Counter from './Counter';

ReactDOM.render(
  <App model={0} update={Counter.update} view={Counter.view} />,
  document.getElementById('container')
);
```

Also this pattern can be reused infinitely in order to aggragate components.

Here an example aggregating two Counter components

`TwoCounters.js`

```javascript
import React from 'react'
import { Address, Action } from 'react-elm'
import * as Counter from './Counter';

export class Model {
  constructor(counter1, counter2) {
    this.counter1 = counter1;
    this.counter2 = counter2;
  }
}

export function view(props) {
  return (
    <div>
      <Counter.view address={ Address.forwardTo(props.address, Action.wrapper("COUNTER1")) } model={ props.model.counter1 } />
      <Counter.view address={ Address.forwardTo(props.address, Action.wrapper("COUNTER2")) } model={ props.model.counter2 } />
      <button onClick={ (e) => Address.send(props.address, new Action("RESET")) }>Reset</button>
    </div>
  );
}

export function update(action, model) {
  switch(action.type) {
    case "COUNTER1":
      return new Model(Counter.update(action.wrapped, model.counter1), model.counter2);

    case "COUNTER2":
      return new Model(model.counter1, Counter.update(action.wrapped, model.counter2));

    case "RESET":
      return new Model(0, 0);
  }
  return model;
}
```

`index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'react-elm'
import * as TwoCounters from './TwoCounters';

ReactDOM.render(
  <App model={new TwoCounters.Model(0, 0)} update={TwoCounters.update} view={TwoCounters.view} />,
  document.getElementById('container')
);
````

Now a more fancy example. Here we are going to create an dynamic list of Counters.

`ListCounters.js`

```javascript
import React from 'react'
import { Address, Action } from 'react-elm'
import * as Counter from './Counter';

export class Model {
  constructor(counters) {
    this.counters = counters;
  }
}

export function view(props) {
  var counters = props.model.counters.map(function(item, index) {
      return (<Counter.view key={ index } address={ Address.forwardTo(props.address, Action.wrapper("CHILD", {index})) } model={ item } />)
  });

  return (
    <div>
      <button onClick={ (e) => Address.send(props.address, new Action("ADD")) }>Add</button>
      <div>{counters}</div>
    </div>
  );
}

export function update(action, model) {
  switch(action.type) {
    case "CHILD":
      var counters = model.counters.map(function(item, index) {
        if(index == action.index)
          return Counter.update(action.wrapped, item);
        return item;
      });

      return new Model(counters);

    case "ADD":
      return new Model(model.counters.concat([0]));
  }

  return model;
}
```

`index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'react-elm'
import * as ListCounters from './ListCounters';

ReactDOM.render(
  <App model={new ListCounters.Model([0, 0, 0, 0])} update={ListCounters.update} view={ListCounters.view} />,
  document.getElementById('container')
);
```

