/* ************************************************************************************************
 * Please read the following tutorial before implementing tasks:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
 ************************************************************************************************ */

/**
 * Returns shallow copy of an object.
 */
function shallowCopy(obj) {
  const assign = (source) => ({ ...source });
  return assign(obj);
}

/**
 * Merges an array of objects into a single object.
 * If keys overlap, their values are summed.
 */
function mergeObjects(objects) {
  const result = {};

  objects.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] += value;
      } else {
        result[key] = value;
      }
    });
  });

  return result;
}

/**
 * Removes specified properties from an object.
 */
function removeProperties(obj, keys) {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
}

/**
 * Compares two source objects. Returns true if the objects are equal and false otherwise.
 * There are no nested objects.
 */
function compareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
  );
}

/**
 * Checks if the source object is empty.
 * Returns true if the object contains no enumerable own properties, false otherwise.
 *    isEmptyObject({a: 1}) => false
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Makes the source object immutable by preventing any changes to its properties.
 */
function makeImmutable(obj) {
  return Object.freeze(obj);
}

/**
 * Returns a word from letters whose positions are provided as an object.
 */
function makeWord(lettersObject) {
  const letters = [];

  Object.entries(lettersObject).forEach(([letter, positions]) => {
    positions.forEach((position) => {
      letters[position] = letter;
    });
  });

  return letters.join('');
}

/**
 * There is a queue for tickets to a popular movie.
 * The ticket seller sells one ticket at a time strictly in order and give the change.
 * The ticket costs 25. Customers pay with bills of 25, 50, or 100.
 * Initially the seller has no money for change.
 * Return true if the seller can sell tickets, false otherwise
 */
function sellTickets(queue) {
  let bills25 = 0;
  let bills50 = 0;

  const cannotSell = queue.some((bill) => {
    if (bill === 25) {
      bills25 += 1;
      return false;
    }

    if (bill === 50) {
      if (bills25 < 1) {
        return true;
      }

      bills25 -= 1;
      bills50 += 1;
      return false;
    }

    if (bill === 100) {
      if (bills50 >= 1 && bills25 >= 1) {
        bills50 -= 1;
        bills25 -= 1;
        return false;
      }

      if (bills25 >= 3) {
        bills25 -= 3;
        return false;
      }

      return true;
    }

    return false;
  });

  return !cannotSell;
}

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of an object.
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Creates an object with the specified prototype from JSON.
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}

/**
 * Sorts cities by country, then by city, in ascending order.
 */
function sortCitiesArray(arr) {
  return arr.sort((a, b) => {
    const countryComparison = a.country.localeCompare(b.country);

    if (countryComparison !== 0) {
      return countryComparison;
    }

    return a.city.localeCompare(b.city);
  });
}

/**
 * Groups array elements into a Map using selectors.
 */
function group(array, keySelector, valueSelector) {
  const result = new Map();

  array.forEach((item) => {
    const key = keySelector(item);
    const value = valueSelector(item);

    if (!result.has(key)) {
      result.set(key, []);
    }

    result.get(key).push(value);
  });

  return result;
}

/**
 * CSS selector builder.
 *
 * Selector parts must be ordered as follows:
 * element, id, class, attribute, pseudo-class, pseudo-element.
 */
class CssSelector {
  constructor(parts = [], combined = null) {
    this.parts = parts;
    this.combined = combined;
  }

  addPart(type, value) {
    const order = {
      element: 0,
      id: 1,
      class: 2,
      attr: 3,
      pseudoClass: 4,
      pseudoElement: 5,
    };

    const lastPart = this.parts[this.parts.length - 1];

    if (lastPart && order[type] < order[lastPart.type]) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }

    const singleOccurrenceTypes = ['element', 'id', 'pseudoElement'];

    if (
      singleOccurrenceTypes.includes(type) &&
      this.parts.some((part) => part.type === type)
    ) {
      throw new Error(
        'Element, id and pseudo-element should not occur more than one time inside the selector'
      );
    }

    return new CssSelector([...this.parts, { type, value }]);
  }

  element(value) {
    return this.addPart('element', value);
  }

  id(value) {
    return this.addPart('id', value);
  }

  class(value) {
    return this.addPart('class', value);
  }

  attr(value) {
    return this.addPart('attr', value);
  }

  pseudoClass(value) {
    return this.addPart('pseudoClass', value);
  }

  pseudoElement(value) {
    return this.addPart('pseudoElement', value);
  }

  stringify() {
    if (this.combined) {
      const { selector1, combinator, selector2 } = this.combined;

      return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    }

    return this.parts
      .map(({ type, value }) => {
        switch (type) {
          case 'element':
            return value;
          case 'id':
            return `#${value}`;
          case 'class':
            return `.${value}`;
          case 'attr':
            return `[${value}]`;
          case 'pseudoClass':
            return `:${value}`;
          case 'pseudoElement':
            return `::${value}`;
          default:
            return '';
        }
      })
      .join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const validCombinators = [' ', '+', '~', '>'];

    if (!validCombinators.includes(combinator)) {
      throw new Error('Unknown combinator');
    }

    return new CssSelector([], {
      selector1,
      combinator,
      selector2,
    });
  },
};

module.exports = {
  shallowCopy,
  mergeObjects,
  removeProperties,
  compareObjects,
  isEmptyObject,
  makeImmutable,
  makeWord,
  sellTickets,
  Rectangle,
  getJSON,
  fromJSON,
  group,
  sortCitiesArray,
  cssSelectorBuilder,
};
