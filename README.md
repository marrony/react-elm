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

