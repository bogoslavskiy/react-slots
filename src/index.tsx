import * as React from 'react';
import { nanoid } from 'nanoid/non-secure';

type SlotsNames<T> = {
  [P in keyof T]: string;
}

type RevertSlotsNames<T> = {
  [key: string]: keyof T;
}

type SlotsComponents<T> = {
  [key in keyof T]: React.ReactNode;
}

type SlotProps = {
  showChildren?: boolean;
}

type DisplayName<T = string> = {
  displayName?: T;
}

export function createSlot<P>(
  component: React.ComponentType<P>,
  propsAreEqual?: (
    prevProps: Readonly<React.PropsWithChildren<P & SlotProps>>, 
    nextProps: Readonly<React.PropsWithChildren<P & SlotProps>>
  ) => boolean
) {
  const Component: React.ComponentType<any> = component;
  const Slot = React.memo<P & SlotProps>((props) => {
    const { showChildren, ...otherProps } = props;
    return showChildren ? <Component {...otherProps} /> : null;
  }, propsAreEqual);

  Slot.displayName = `Slot-${nanoid()}`;
  
  return Slot as React.NamedExoticComponent<P & SlotProps> & Required<DisplayName>;
}

export function useSlots<T>(children: React.ReactNode, names: SlotsNames<T>) {
  const revertNames = React.useMemo(() => {
    return Object.keys(names).reduce<RevertSlotsNames<T>>((accumulator, alias) => {
      const key = alias as keyof T;
      const value = names[key];
      accumulator[value] = key;
      return accumulator;
    }, {});
  }, []);

  const slots = React.useMemo(() => {
    const initial = {} as SlotsComponents<T>;
    return Object.keys(names).reduce<SlotsComponents<T>>((slots, key) => {
      slots[key as keyof T] = null;
      return slots;
    }, initial);
  }, []);

  
  return React.Children.toArray(children).reduce<SlotsComponents<T>>((slots, child) => {
    if (React.isValidElement(child)) {
      const type = child.type as React.ReactNode & DisplayName;
      const displayName = type?.displayName;
      const alias = displayName && revertNames[displayName];

      if (alias) {
        slots[alias] = React.cloneElement(child, { showChildren: true });
      }
    }

    return slots;
  }, slots);
};