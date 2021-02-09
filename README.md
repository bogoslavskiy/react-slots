# React Slots 

## Install 

```bash
$ yarn add @bogoslavskiy/react-slots
```

## Usage

```ts
import * as React from 'react';
import { createSlot, useSlots } from '@bogoslavskiy/react-slots';

interface MySlot1Props {
  children?: React.ReactNode;
}

const MySlot1 = createSlot<MySlot1Props>(({ children }) => (
  <div>
    {children}
  </div>
));

interface MySlot2Props {
  text: string;
}

const MySlot2 = createSlot<MySlot2Props>(({ text }) => {
  return (
    <div>
      Text prop is {text}
    </div>
  );
});

const TestComponent = React.memo(({ children }) => {
  const slots = useSlots(children, {
    'Slot1': MySlot1.displayName,
    'Slot2': MySlot2.displayName
  });

  return (
    <div>
      <div>Render MySlot1</div>
      <div>{slots.Slot1}</div>

      <div>{children}</div>

      <div>
        <div>Render MySlot2</div>
        <div>{slots.Slot2}</div>
      </div>
    </div>
  )
});

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <TestComponent>
      <MySlot1>
        <div>This is slot 1</div>
        <div>Count: {count}</div>
      </MySlot1>
      <MySlot2 text="Hello" />

      <button onClick={() => setCount(count + 1)}>
        Press me
      </button>
    </TestComponent>
  )
};

```
