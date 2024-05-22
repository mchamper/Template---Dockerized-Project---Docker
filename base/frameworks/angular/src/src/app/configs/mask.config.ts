export const maskConfig = {
  get: (key: string) => (maskConfig as any)[key],
  /* -------------------- */
  number: 'separator.0',
  price: 'separator.2',
  phone: '(00) 0000-0000||(000) 0000-0000||(0000) 0000-0000||+00 000 0000-0000',
  dni: '0.000.000||00.000.000',
  cbu: '00000000 00000000000000',
  /* -------------------- */
  customs: {
    creditCard: {
      options: {
        default: {
          number: '1000 000000 00000||1000 0000 0000 0000',
          cvv: '000||0000',
        },
        amex: {
          number: '3000 000000 00000',
          cvv: '0000',
        },
        visa: {
          number: '4000 0000 0000 0000',
          cvv: '000',
        },
        master: {
          number: '5000 0000 0000 0000',
          cvv: '000',
        },
        discover: {
          number: '6000 0000 0000 0000',
          cvv: '000',
        },
      },
      patterns: {
        '0': { pattern: new RegExp(/[0-9]/) },
        '1': { pattern: new RegExp(/3|4|5|6/) },
        '3': { pattern: new RegExp(/3/) },
        '4': { pattern: new RegExp(/4/) },
        '5': { pattern: new RegExp(/5/) },
        '6': { pattern: new RegExp(/6/) },
      }
    },
    string: {
      patterns: {
        'a': { pattern: new RegExp(/[a-zA-Z0-9\ ]/) },
        'A': { pattern: new RegExp(/[a-zA-Z0-9]/) },
        's': { pattern: new RegExp(/[a-zA-Z\ ]/) },
        'S': { pattern: new RegExp(/[a-zA-Z]/) },
      }
    },
  },
}
