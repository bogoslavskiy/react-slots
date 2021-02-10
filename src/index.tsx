import * as React from 'react';

type SlotComponent<P, T> = React.NamedExoticComponent<P & SlotProps> & Required<DisplayName<T>>;

type SlotsComponents<T extends string[]> = {
  [key in T[number]]: React.ReactNode;
}

type SlotProps = {
  showChildren?: boolean;
  children?: React.ReactNode;
}

type DisplayName<T = string> = {
  displayName?: T;
}

export function createSlot<T extends string>(displayName: T) {
  const memo = <P extends {}>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (
      prevProps: Readonly<React.PropsWithChildren<P & SlotProps>>, 
      nextProps: Readonly<React.PropsWithChildren<P & SlotProps>>
    ) => boolean
  ) => { 
    const SlotComponent = React.memo<P & SlotProps>((props) => {
      return props.showChildren ? <Component {...props} /> : null;
    }, propsAreEqual);

    SlotComponent.displayName = displayName;
    
    return SlotComponent as SlotComponent<P, T>;
  }

  return { memo, displayName };
}

export function useSlots<T extends string[]>(children: React.ReactNode, names: T) {
  const namesSet = React.useMemo(() => new Set(names), []);
  const slots = React.useMemo(() => {
    const accumulator = {} as SlotsComponents<T>;
    return names.reduce((slots, name: T[number]) => {
      slots[name] = null;
      return slots;
    }, accumulator);
  }, []);
  
  return React.Children.toArray(children).reduce<SlotsComponents<T>>((slots, child) => {
    if (React.isValidElement(child)) {
      const type = child.type as React.ReactNode & DisplayName;
      const displayName = type?.displayName as T[number] | undefined;
      const alias = displayName && namesSet.has(displayName) ? displayName : undefined;

      if (alias) {
        slots[alias] = React.cloneElement(child, { showChildren: true });
      }
    }

    return slots;
  }, slots);
};