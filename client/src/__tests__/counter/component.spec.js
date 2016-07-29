import expect, { createSpy, spyOn, isSpy } from 'expect';
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Counter from '../../components/Counter';

describe('<Counter />', () => {
  let wrapper;
  let count;
  let incCounterSpy;
  let decCounterSpy;

  beforeEach(() => {
    incCounterSpy = createSpy().andCall(() => count++);
    decCounterSpy = createSpy().andCall(() => count--);

    count = 0;
    wrapper = shallow(
      <Counter
        incrementCounter={incCounterSpy}
        decrementCounter={decCounterSpy}
        value={count}
      />
    );
  });

  it('should have class counter', () => {
    expect(wrapper.hasClass('counter')).toBe(true);
  });

  it('should have a count of zero', () => {
    expect(wrapper.text()).toEqual('Counter: 0+-');
  });

  describe('incrementing the counter', () => {
    let incButton;
    beforeEach(() => {
      incButton = wrapper.find('button').first();
      incButton.simulate('click');
    });

    it('should increment the count', () => {
      expect(count).toEqual(1);
    });

    it('should call the increment callback', () => {
      expect(incCounterSpy).toHaveBeenCalled();
      expect(decCounterSpy).toNotHaveBeenCalled();
    })
  });

  describe('decrementing the counter', () => {
    let decButton;
    beforeEach(() => {
      decButton = wrapper.find('button').last();
      decButton.simulate('click');
    });

    it('should decrement the count', () => {
      expect(count).toEqual(-1);
    });

    it('should call the decrement callback', () => {
      expect(decCounterSpy).toHaveBeenCalled();
      expect(incCounterSpy).toNotHaveBeenCalled();
    })
  });
});
