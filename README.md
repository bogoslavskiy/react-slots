# React Slots 
[![npm version](https://badge.fury.io/js/%40bogoslavskiy%2Freact-slots.svg)](https://badge.fury.io/js/%40bogoslavskiy%2Freact-slots)

Allows you to create a hierarchical component model instead of passing large components through render props.
<br />
Works with React and React Native.
## Install 

```bash
$ yarn add @bogoslavskiy/react-slots
```

## Examples
### Without slots (Standard practice)
```ts 
import * as React from 'react';

interface HeaderProps {
  title: string;
}

const Header = React.memo<HeaderProps>(({ title }) => {
  return (
    <div>
      {title}
    </div>
  );
});

const Footer = React.memo(({ children }) => (
  <div>
    {children}
  </div>
));

interface PageProps {
  HeaderComponent: () => React.ReactNode;
  FooterComponent: () => React.ReactNode;
}

const Page = React.memo<PageProps>((props) => {
  const { children, HeaderComponent, FooterComponent } = props;

  return (
    <div>
      <div>
        <div>Render Header</div>
        <div>{HeaderComponent}</div>
      </div>

      <div>{children}</div>

      <div>
        <div>Render Footer</div>
        <div>{FooterComponent}</div>
      </div>
    </div>
  )
});

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Page
      HeaderComponent={() => (
        <Header title="Title" />
      )}
      FooterComponent={() => (
        <Footer>
          <div>This is slot 1</div>
          <div>Count: {count}</div>
          {/* 
            There can be many nested components here.
            The more components, the harder it is to read the code
          */}
        </Footer>
      )}
    >
      <button onClick={() => setCount(count + 1)}>
        Press me
      </button>
    </Page>
  )
};
```

### With slots

```ts
import * as React from 'react';
import { createSlot, useSlots } from '@bogoslavskiy/react-slots';

interface HeaderProps {
  title: string;
}

const HeaderSlot = createSlot('Header');
const Header = HeaderSlot.memo<HeaderProps>(({ title }) => {
  return (
    <div>
      {title}
    </div>
  );
});

const Footer = createSlot('Footer').memo(({ children }) => (
  <div>
    {children}
  </div>
));

const Page = React.memo(({ children }) => {
  const Slots = useSlots(children, [
    HeaderSlot.displayName,
    Footer.displayName
  ]);

  return (
    <div>
      <div>
        <div>Render Header</div>
        <div>{Slots.Header}</div>
      </div>

      <div>{children}</div>

      <div>
        <div>Render Footer</div>
        <div>{Slots.Footer}</div>
      </div>
    </div>
  )
});

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Page>
      <Header title="Title" />

      <button onClick={() => setCount(count + 1)}>
        Press me
      </button>

       <Footer>
        <div>This is slot 1</div>
        <div>Count: {count}</div>
      </Footer>
    </Page>
  )
};
```
