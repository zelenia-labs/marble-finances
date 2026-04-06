import { MonthRecord, MonthVersion } from '../store/finance.store';

export interface DemoData {
  months: MonthRecord[];
  marbleMultiplier: number;
  snapshots: Record<string, MonthVersion | null>;
  customColors: string[];
}

export const DEMO_DATA: DemoData = {
  "months": [
    {
      "id": "january_2024",
      "date": "January 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_ar0jselu8",
          "label": "Review budget for January",
          "completed": true
        },
        {
          "id": "todo_zv3lmgkn8",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_i9ki5htgi",
          "label": "Mortgage",
          "val": 2.99,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_kvva23ytl",
          "label": "Groceries",
          "val": 0.59,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_bf3sxr2h2",
          "label": "Trips",
          "val": 1.16,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_fb6l52gnc",
          "label": "Dining",
          "val": 0.45,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_hou7wkfc9",
          "label": "Salary",
          "val": 8.67,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_4otk4lpnw",
          "label": "Business Income",
          "val": 3.95,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_5saxtjz3a",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_zcvmsy6qe",
              "label": "Marcus HYSA",
              "val": 23.866203774148374,
              "note": "3.65% APY"
            },
            {
              "id": "asset_igludf7me",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_8goie74v2",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_yyw6p9nj1",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_k66mvuvpz",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_3wnipxv9s",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_xb8dnc0pk",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_xe6we0qm4",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_1idcvle7j",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_pmq1onz1e",
              "label": "Primary Residence (Equity)",
              "val": 75.18387439497019
            }
          ]
        },
        {
          "id": "cat_bpa0gv0at",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_january_2024",
              "label": "Fidelity Account",
              "val": 31.569382007572543
            },
            {
              "id": "asset_schwab_january_2024",
              "label": "Charles Schwab Account",
              "val": 24.24428859202236
            }
          ]
        },
        {
          "id": "cat_i3lv6umft",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_qx5log7ms",
              "label": "Fidelity 401k",
              "val": 86.8059637794428,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_zdwa1ene3",
              "label": "Fidelity HSA",
              "val": 9.076033381487411
            },
            {
              "id": "asset_psw1ggz83",
              "label": "Schwab IRA",
              "val": 29.07084969662839
            },
            {
              "id": "asset_czc36huao",
              "label": "Schwab Roth IRA",
              "val": 22.801566522710782
            },
            {
              "id": "asset_g27pk9o0y",
              "label": "Inspira Financial HSA",
              "val": 7.462807794893548
            }
          ]
        }
      ]
    },
    {
      "id": "february_2024",
      "date": "February 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_yll1vgrj2",
          "label": "Review budget for February",
          "completed": true
        },
        {
          "id": "todo_0epd3bt3o",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_nb6aeis3a",
          "label": "Mortgage",
          "val": 2.97,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_2mzotd0lk",
          "label": "Groceries",
          "val": 0.61,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_rv370k985",
          "label": "Trips",
          "val": 1.17,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_67u4o0k6v",
          "label": "Dining",
          "val": 0.47,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_u17b3nbka",
          "label": "Salary",
          "val": 8.66,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_3t4ny75ch",
          "label": "Business Income",
          "val": 3.85,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_jidurlimb",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_t0iaa1eni",
              "label": "Marcus HYSA",
              "val": 29.466203774148376,
              "note": "3.65% APY"
            },
            {
              "id": "asset_79dgpl9dn",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_1kly47xif",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_ogu30fpds",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_7j91o1ovj",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_0ct6ipf8q",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_4ju8le3st",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_ga6cmmivi",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_zuhgo88j6",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_vp1f9pf80",
              "label": "Primary Residence (Equity)",
              "val": 75.2173607412125
            }
          ]
        },
        {
          "id": "cat_gawkd70e8",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_february_2024",
              "label": "Fidelity Account",
              "val": 31.56968565427087
            },
            {
              "id": "asset_schwab_february_2024",
              "label": "Charles Schwab Account",
              "val": 24.244521783099163
            }
          ]
        },
        {
          "id": "cat_1cx2ml70n",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_w6e892wua",
              "label": "Fidelity 401k",
              "val": 86.80679871324956,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_dj74v3xub",
              "label": "Fidelity HSA",
              "val": 9.076120678336286
            },
            {
              "id": "asset_mnejmgb7t",
              "label": "Schwab IRA",
              "val": 29.071129311462972
            },
            {
              "id": "asset_8asw5tht0",
              "label": "Schwab Roth IRA",
              "val": 22.801785837120853
            },
            {
              "id": "asset_gzk2czn70",
              "label": "Inspira Financial HSA",
              "val": 7.46287957510599
            }
          ]
        }
      ]
    },
    {
      "id": "march_2024",
      "date": "March 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_o9p1elti5",
          "label": "Review budget for March",
          "completed": true
        },
        {
          "id": "todo_4o8m03vvq",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_7w83un896",
          "label": "Mortgage",
          "val": 2.65,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_o1ol30w8a",
          "label": "Groceries",
          "val": 0.68,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_lf9k2bs9j",
          "label": "Trips",
          "val": 1.3,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_dey5uwxno",
          "label": "Dining",
          "val": 0.42,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_7uvicgfd3",
          "label": "Salary",
          "val": 8.85,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_3dgwwcedx",
          "label": "Business Income",
          "val": 4.26,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_triow5ge0",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_7gzcvlkf5",
              "label": "Marcus HYSA",
              "val": 35.06620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_gns3ir02u",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_1f214lwlw",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_d5zke45xu",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_wobvqn3zr",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_gif24djpb",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_kdt4h9g6g",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_g597unlew",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_2exn721jp",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_pezgt4oh2",
              "label": "Primary Residence (Equity)",
              "val": 75.50041126330245
            }
          ]
        },
        {
          "id": "cat_xfuvbvot4",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_march_2024",
              "label": "Fidelity Account",
              "val": 32.43752076769706
            },
            {
              "id": "asset_schwab_march_2024",
              "label": "Charles Schwab Account",
              "val": 24.91099174868633
            }
          ]
        },
        {
          "id": "cat_41hy15z3h",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_uxwm1yfrb",
              "label": "Fidelity 401k",
              "val": 89.19307486539383,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_wl1g08s72",
              "label": "Fidelity HSA",
              "val": 9.325618766616687
            },
            {
              "id": "asset_97cp04b8i",
              "label": "Schwab IRA",
              "val": 29.87028034133798
            },
            {
              "id": "asset_gqo3r589r",
              "label": "Schwab Roth IRA",
              "val": 23.428595701969808
            },
            {
              "id": "asset_wqgilx1cl",
              "label": "Inspira Financial HSA",
              "val": 7.668030459833661
            }
          ]
        }
      ]
    },
    {
      "id": "april_2024",
      "date": "April 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_4uo8gj6lh",
          "label": "Review budget for April",
          "completed": true
        },
        {
          "id": "todo_qoa3e5ve5",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_yh8c4z0pw",
          "label": "Mortgage",
          "val": 2.74,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_24enfh2zt",
          "label": "Groceries",
          "val": 0.66,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_houx81hsw",
          "label": "Trips",
          "val": 1.2,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_3fs6z4dmw",
          "label": "Dining",
          "val": 0.43,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_fjdekrmcu",
          "label": "Salary",
          "val": 8.62,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_f0inotyh4",
          "label": "Business Income",
          "val": 3.83,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_035a868z6",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_iekxkwct5",
              "label": "Marcus HYSA",
              "val": 40.66620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_6y6ysxd8m",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_xbvsziz06",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_oqanty8o0",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_4v3j7urq6",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_uq6zeu0v6",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_da4z7uc6w",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_zgxxqtgia",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_qtzwpanty",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_lg6cuowsm",
              "label": "Primary Residence (Equity)",
              "val": 75.78173139534334
            }
          ]
        },
        {
          "id": "cat_ifp20etum",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_april_2024",
              "label": "Fidelity Account",
              "val": 33.19826209319503
            },
            {
              "id": "asset_schwab_april_2024",
              "label": "Charles Schwab Account",
              "val": 25.495217066585376
            }
          ]
        },
        {
          "id": "cat_n4qz9nt68",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_qicvhvfik",
              "label": "Fidelity 401k",
              "val": 91.28487647021656,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_z2okm796z",
              "label": "Fidelity HSA",
              "val": 9.544327947025742
            },
            {
              "id": "asset_b1qi2toby",
              "label": "Schwab IRA",
              "val": 30.570813431477678
            },
            {
              "id": "asset_v5o0qr875",
              "label": "Schwab Roth IRA",
              "val": 23.97805510968822
            },
            {
              "id": "asset_dtbdj7ed7",
              "label": "Inspira Financial HSA",
              "val": 7.847865031586193
            }
          ]
        }
      ]
    },
    {
      "id": "may_2024",
      "date": "May 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_6plcgzfyk",
          "label": "Review budget for May",
          "completed": true
        },
        {
          "id": "todo_2f8cr7wst",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_4ua476hr3",
          "label": "Mortgage",
          "val": 2.54,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_3jzouhsid",
          "label": "Groceries",
          "val": 0.59,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_0tpp5p602",
          "label": "Trips",
          "val": 1.23,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_dvp7y20n0",
          "label": "Dining",
          "val": 0.44,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_yy2d8krgl",
          "label": "Salary",
          "val": 8.46,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_f3ytned25",
          "label": "Business Income",
          "val": 3.85,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_foq4s8pnf",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_zi1s431ro",
              "label": "Marcus HYSA",
              "val": 46.26620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_3e7eka2es",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_gw9ks0wfb",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_3ttiirt1v",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_v4luwvqut",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_r2r9ms6an",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_y7kxto0f1",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_dpoowie0i",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_3wuthw5bv",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_amd15rx0e",
              "label": "Primary Residence (Equity)",
              "val": 75.79456229308114
            }
          ]
        },
        {
          "id": "cat_4cjz87h6y",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_may_2024",
              "label": "Fidelity Account",
              "val": 34.08445898204904
            },
            {
              "id": "asset_schwab_may_2024",
              "label": "Charles Schwab Account",
              "val": 26.17578829593587
            }
          ]
        },
        {
          "id": "cat_nuaprpo84",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_83q7xibk4",
              "label": "Fidelity 401k",
              "val": 93.72164178341984,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_fg6say5sv",
              "label": "Fidelity HSA",
              "val": 9.799104950385518
            },
            {
              "id": "asset_pyx1sg0bc",
              "label": "Schwab IRA",
              "val": 31.386873009435682
            },
            {
              "id": "asset_kdx2h318o",
              "label": "Schwab Roth IRA",
              "val": 24.618127104400603
            },
            {
              "id": "asset_bsq3hkpma",
              "label": "Inspira Financial HSA",
              "val": 8.057356527123348
            }
          ]
        }
      ]
    },
    {
      "id": "june_2024",
      "date": "June 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_4ryfytm0l",
          "label": "Review budget for June",
          "completed": true
        },
        {
          "id": "todo_w4h199qtw",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_74om9x8gv",
          "label": "Mortgage",
          "val": 2.53,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ezfiqv0x4",
          "label": "Groceries",
          "val": 0.7,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_c74a55yaq",
          "label": "Trips",
          "val": 1.12,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zyfsnm61x",
          "label": "Dining",
          "val": 0.47,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ts0krai9p",
          "label": "Salary",
          "val": 8.66,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_4ges2f3jl",
          "label": "Business Income",
          "val": 4.36,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_2e678vr6d",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_qc2lmct7g",
              "label": "Marcus HYSA",
              "val": 51.86620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_6okcnc9km",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_wyf33jauc",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_ymo78i2s0",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_rjfc9xpdz",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_9g6ido7m5",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_bapjjj3d4",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_yuxvrzh5c",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_brz08qryw",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_21h9gurw0",
              "label": "Primary Residence (Equity)",
              "val": 75.87420528740503
            }
          ]
        },
        {
          "id": "cat_irjhitzvh",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_june_2024",
              "label": "Fidelity Account",
              "val": 34.826540855238036
            },
            {
              "id": "asset_schwab_june_2024",
              "label": "Charles Schwab Account",
              "val": 26.74568374362588
            }
          ]
        },
        {
          "id": "cat_zt191xn5z",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_twuz5vagb",
              "label": "Fidelity 401k",
              "val": 95.76213570851388,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_t6j49vzc1",
              "label": "Fidelity HSA",
              "val": 10.012449635157758
            },
            {
              "id": "asset_8lbv8eepm",
              "label": "Schwab IRA",
              "val": 32.07022343399879
            },
            {
              "id": "asset_por8okyhq",
              "label": "Schwab Roth IRA",
              "val": 25.15410937965572
            },
            {
              "id": "asset_nqkn92m8z",
              "label": "Inspira Financial HSA",
              "val": 8.232780119082026
            }
          ]
        }
      ]
    },
    {
      "id": "july_2024",
      "date": "July 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_w9ggi0p47",
          "label": "Review budget for July",
          "completed": true
        },
        {
          "id": "todo_tfheyx6rs",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_8rkp93uxh",
          "label": "Mortgage",
          "val": 2.82,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_h4hclc2kf",
          "label": "Groceries",
          "val": 0.66,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1kpiepo8j",
          "label": "Trips",
          "val": 1.13,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_p3p49h12l",
          "label": "Dining",
          "val": 0.48,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zgr9ypcdt",
          "label": "Salary",
          "val": 8.62,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_6xcby52rs",
          "label": "Business Income",
          "val": 3.87,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_5u6ermq33",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_x5508nvxe",
              "label": "Marcus HYSA",
              "val": 57.46620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_rnuoz8siz",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_zzrf502zc",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_1en8gjd96",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_qub74zwfl",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_bwasalvwi",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_hvpgxyrnu",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_cpgdfxf2t",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_dc2122qc3",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_fhfr7qx6g",
              "label": "Primary Residence (Equity)",
              "val": 76.08536961101612
            }
          ]
        },
        {
          "id": "cat_qrykjj3o7",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_july_2024",
              "label": "Fidelity Account",
              "val": 35.687296644795936
            },
            {
              "id": "asset_schwab_july_2024",
              "label": "Charles Schwab Account",
              "val": 27.406717012008833
            }
          ]
        },
        {
          "id": "cat_z1ypzbfm9",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_b70l8f7d2",
              "label": "Fidelity 401k",
              "val": 98.1289459258753,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_9ugkgyv5f",
              "label": "Fidelity HSA",
              "val": 10.259912454590273
            },
            {
              "id": "asset_cuqtn1obq",
              "label": "Schwab IRA",
              "val": 32.862855427166664
            },
            {
              "id": "asset_44ony2mho",
              "label": "Schwab Roth IRA",
              "val": 25.775806072695353
            },
            {
              "id": "asset_2s1vuz988",
              "label": "Inspira Financial HSA",
              "val": 8.436257495176102
            }
          ]
        }
      ]
    },
    {
      "id": "august_2024",
      "date": "August 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_ka5a89syh",
          "label": "Review budget for August",
          "completed": true
        },
        {
          "id": "todo_oznqks9nz",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_4jhmgvosv",
          "label": "Mortgage",
          "val": 2.94,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_00mzh7cae",
          "label": "Groceries",
          "val": 0.62,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_rrq8e0kd5",
          "label": "Trips",
          "val": 1.29,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1pqsjlvqw",
          "label": "Dining",
          "val": 0.43,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_0ohfoyt6w",
          "label": "Salary",
          "val": 7.95,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_36qanntbf",
          "label": "Business Income",
          "val": 3.98,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_wo52xlcfj",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_lzolyq7c2",
              "label": "Marcus HYSA",
              "val": 63.066203774148384,
              "note": "3.65% APY"
            },
            {
              "id": "asset_8bgtn2wz2",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_q6sit8ujp",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_j2ekfgn39",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_bvn6272l3",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_dht4woip3",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_0qd9qrvo5",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_miawgp7k5",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_qkfbpma79",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_l4znffecz",
              "label": "Primary Residence (Equity)",
              "val": 76.3872152507388
            }
          ]
        },
        {
          "id": "cat_i4h6eons1",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_august_2024",
              "label": "Fidelity Account",
              "val": 35.405780106211864
            },
            {
              "id": "asset_schwab_august_2024",
              "label": "Charles Schwab Account",
              "val": 27.19052119914109
            }
          ]
        },
        {
          "id": "cat_2b1ulu6oy",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_7rur6tfhx",
              "label": "Fidelity 401k",
              "val": 97.35486316284303,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_9dw1mm7xa",
              "label": "Fidelity HSA",
              "val": 10.17897791171525
            },
            {
              "id": "asset_wfr8fge8h",
              "label": "Schwab IRA",
              "val": 32.603619279359606
            },
            {
              "id": "asset_0ubsg69az",
              "label": "Schwab Roth IRA",
              "val": 25.572475577336647
            },
            {
              "id": "asset_4me6uaand",
              "label": "Inspira Financial HSA",
              "val": 8.369708716424821
            }
          ]
        }
      ]
    },
    {
      "id": "september_2024",
      "date": "September 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_1tu9buznc",
          "label": "Review budget for September",
          "completed": true
        },
        {
          "id": "todo_3tf3oll1m",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_xj9blpaxq",
          "label": "Mortgage",
          "val": 2.78,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_jekgjcxf5",
          "label": "Groceries",
          "val": 0.7,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_h800kr84y",
          "label": "Trips",
          "val": 1.18,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_8stla1r88",
          "label": "Dining",
          "val": 0.42,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_xipyp151k",
          "label": "Salary",
          "val": 8.65,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_vxs578k4c",
          "label": "Business Income",
          "val": 4.47,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_i2m7jekl3",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_sy60w0b1i",
              "label": "Marcus HYSA",
              "val": 68.66620377414839,
              "note": "3.65% APY"
            },
            {
              "id": "asset_qb1ypwost",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_fsz6097s6",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_wj4lp533o",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_owiwxa9iv",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_bup3p0vcp",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_m3x74wpca",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_xqzm4xtw9",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_y4wum1z6b",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_f8z32957h",
              "label": "Primary Residence (Equity)",
              "val": 76.43363987086562
            }
          ]
        },
        {
          "id": "cat_2makrlgtt",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_september_2024",
              "label": "Fidelity Account",
              "val": 35.99763341221268
            },
            {
              "id": "asset_schwab_september_2024",
              "label": "Charles Schwab Account",
              "val": 27.64504585063362
            }
          ]
        },
        {
          "id": "cat_wh5m84y8x",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_gn5w5ax4i",
              "label": "Fidelity 401k",
              "val": 98.98227533806796,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_ar1km7w0f",
              "label": "Fidelity HSA",
              "val": 10.349132663585864
            },
            {
              "id": "asset_0yb9hecge",
              "label": "Schwab IRA",
              "val": 33.14863085092205
            },
            {
              "id": "asset_1iik8qtkj",
              "label": "Schwab Roth IRA",
              "val": 25.9999525081561
            },
            {
              "id": "asset_a4xwfmcmd",
              "label": "Inspira Financial HSA",
              "val": 8.509619198815543
            }
          ]
        }
      ]
    },
    {
      "id": "october_2024",
      "date": "October 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_p69k7od9v",
          "label": "Review budget for October",
          "completed": true
        },
        {
          "id": "todo_5rqd6d5jh",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_q23yz6cx0",
          "label": "Mortgage",
          "val": 2.63,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_cylf5acm7",
          "label": "Groceries",
          "val": 0.66,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1ogrry2k5",
          "label": "Trips",
          "val": 1.11,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_7c9cw5odi",
          "label": "Dining",
          "val": 0.49,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_s7txw34xn",
          "label": "Salary",
          "val": 9.17,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_rzpmynudt",
          "label": "Business Income",
          "val": 4.07,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_oxk8k3xx2",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_vdfdqsn0q",
              "label": "Marcus HYSA",
              "val": 74.26620377414838,
              "note": "3.65% APY"
            },
            {
              "id": "asset_7kfdlsn9l",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_jo87pumbj",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_wlhdlaf7o",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_rwr7d0lm3",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_yfxhhiig2",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_9skb4f7gh",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_a94s9juw2",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_t6e8ll9uf",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_06l74lwep",
              "label": "Primary Residence (Equity)",
              "val": 76.5226138184992
            }
          ]
        },
        {
          "id": "cat_xvgmmi5z8",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_october_2024",
              "label": "Fidelity Account",
              "val": 36.47651038402012
            },
            {
              "id": "asset_schwab_october_2024",
              "label": "Charles Schwab Account",
              "val": 28.012808244645274
            }
          ]
        },
        {
          "id": "cat_z3b7k5vjb",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_aw0mjed77",
              "label": "Fidelity 401k",
              "val": 100.29903779669179,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_tnybh9xh1",
              "label": "Fidelity HSA",
              "val": 10.48680730608306
            },
            {
              "id": "asset_a8ttizht1",
              "label": "Schwab IRA",
              "val": 33.58960750568367
            },
            {
              "id": "asset_np2eixfvd",
              "label": "Schwab Roth IRA",
              "val": 26.345830204660977
            },
            {
              "id": "asset_wo2coz0o7",
              "label": "Inspira Financial HSA",
              "val": 8.622822770464248
            }
          ]
        }
      ]
    },
    {
      "id": "november_2024",
      "date": "November 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_vgd09k52p",
          "label": "Review budget for November",
          "completed": true
        },
        {
          "id": "todo_q2abm6mme",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_y4ec9v7xb",
          "label": "Mortgage",
          "val": 2.62,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zizdbkr8q",
          "label": "Groceries",
          "val": 0.6,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ne5grq2sl",
          "label": "Trips",
          "val": 1.23,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_n6rqy9rwt",
          "label": "Dining",
          "val": 0.44,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_gxqsyjdwq",
          "label": "Salary",
          "val": 8.91,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_jezoiolj2",
          "label": "Business Income",
          "val": 3.92,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_1cyqp5xw6",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_9qzq09kdm",
              "label": "Marcus HYSA",
              "val": 79.86620377414837,
              "note": "3.65% APY"
            },
            {
              "id": "asset_yxe3k7q1u",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_egm8ihdwn",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_jo4ty2gos",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_ilfwola4x",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_db5lnxcfc",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_s91n68q83",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_gcmqrkuye",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_f0sbaig2k",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_r0gpoatxf",
              "label": "Primary Residence (Equity)",
              "val": 76.78155039274318
            }
          ]
        },
        {
          "id": "cat_zyi6n3sef",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_november_2024",
              "label": "Fidelity Account",
              "val": 36.2917810981712
            },
            {
              "id": "asset_schwab_november_2024",
              "label": "Charles Schwab Account",
              "val": 27.87094198586184
            }
          ]
        },
        {
          "id": "cat_7ggd5oux6",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_y3v3exntr",
              "label": "Fidelity 401k",
              "val": 99.7910898206257,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_0oruh5md4",
              "label": "Fidelity HSA",
              "val": 10.433698595735136
            },
            {
              "id": "asset_mvpv2dec4",
              "label": "Schwab IRA",
              "val": 33.419498464518675
            },
            {
              "id": "asset_4b4d1lny3",
              "label": "Schwab Roth IRA",
              "val": 26.212406081915507
            },
            {
              "id": "asset_aub74d7jt",
              "label": "Inspira Financial HSA",
              "val": 8.579153903140593
            }
          ]
        }
      ]
    },
    {
      "id": "december_2024",
      "date": "December 2024",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_lxeozt226",
          "label": "Review budget for December",
          "completed": true
        },
        {
          "id": "todo_ykeoi9ll8",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_b7sunsyqx",
          "label": "Mortgage",
          "val": 2.56,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_xh83zn5gc",
          "label": "Groceries",
          "val": 0.59,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_uf8uhvx5y",
          "label": "Trips",
          "val": 1.25,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_5j6yg21g1",
          "label": "Dining",
          "val": 0.47,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ky4phzo1u",
          "label": "Salary",
          "val": 8.72,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_zbq2vaqri",
          "label": "Business Income",
          "val": 3.78,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_nmhruuudm",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_vny25fq6u",
              "label": "Marcus HYSA",
              "val": 85.46620377414837,
              "note": "3.65% APY"
            },
            {
              "id": "asset_alv17mfln",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_29eracvtc",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_j3wqcaw26",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_hp8lqf5d2",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_hzmv0k94u",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_lt33rcklx",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_xj47iwfs0",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_sf631rlh8",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_sgbnepciy",
              "label": "Primary Residence (Equity)",
              "val": 77.01188608514117
            }
          ]
        },
        {
          "id": "cat_mhi07mdgj",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_december_2024",
              "label": "Fidelity Account",
              "val": 37.006682726803376
            },
            {
              "id": "asset_schwab_december_2024",
              "label": "Charles Schwab Account",
              "val": 28.419963863936864
            }
          ]
        },
        {
          "id": "cat_d85yzlelc",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_cjccoqma0",
              "label": "Fidelity 401k",
              "val": 101.75684654231331,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_ppo5k3qnp",
              "label": "Fidelity HSA",
              "val": 10.639229101349372
            },
            {
              "id": "asset_ws83qc6fw",
              "label": "Schwab IRA",
              "val": 34.077819802226706
            },
            {
              "id": "asset_wi41wghab",
              "label": "Schwab Roth IRA",
              "val": 26.7287569258611
            },
            {
              "id": "asset_2cn4hsmoz",
              "label": "Inspira Financial HSA",
              "val": 8.748152252410103
            }
          ]
        }
      ]
    },
    {
      "id": "january_2025",
      "date": "January 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_pawqxotli",
          "label": "Review budget for January",
          "completed": true
        },
        {
          "id": "todo_7qem8x5rv",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_ub7rkr437",
          "label": "Mortgage",
          "val": 2.91,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_x17mka6ix",
          "label": "Groceries",
          "val": 0.62,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_3food8kaa",
          "label": "Trips",
          "val": 1.22,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ib9200zoz",
          "label": "Dining",
          "val": 0.49,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_2pgy059qd",
          "label": "Salary",
          "val": 8.01,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_ii7pva7qb",
          "label": "Business Income",
          "val": 4.3,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_pti2s44ep",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_jm8ti2a4q",
              "label": "Marcus HYSA",
              "val": 91.06620377414836,
              "note": "3.65% APY"
            },
            {
              "id": "asset_cyehw2ou2",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_1mtrfa9rx",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_vkq700vl7",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_4rfv9c28f",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_679qs5752",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_pxql45a97",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_1hte4iufg",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_52hxjy2vk",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_8kcy46e56",
              "label": "Primary Residence (Equity)",
              "val": 77.02725302753704
            }
          ]
        },
        {
          "id": "cat_mqqeb1ut4",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_january_2025",
              "label": "Fidelity Account",
              "val": 38.39259380386812
            },
            {
              "id": "asset_schwab_january_2025",
              "label": "Charles Schwab Account",
              "val": 29.48429981157051
            }
          ]
        },
        {
          "id": "cat_dqui7f91w",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_unnhw4flz",
              "label": "Fidelity 401k",
              "val": 105.56767016655635,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_g4dcmwljw",
              "label": "Fidelity HSA",
              "val": 11.037671338710735
            },
            {
              "id": "asset_fmoq188r3",
              "label": "Schwab IRA",
              "val": 35.35404410730107
            },
            {
              "id": "asset_muhj3mg3j",
              "label": "Schwab Roth IRA",
              "val": 27.729756679694525
            },
            {
              "id": "asset_qsxrpk7el",
              "label": "Inspira Financial HSA",
              "val": 9.075773109431225
            }
          ]
        }
      ]
    },
    {
      "id": "february_2025",
      "date": "February 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_4gdfxuu37",
          "label": "Review budget for February",
          "completed": true
        },
        {
          "id": "todo_bkpdvjkld",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_awc2asl2f",
          "label": "Mortgage",
          "val": 2.57,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_977dtle3i",
          "label": "Groceries",
          "val": 0.68,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_oyz4gvpga",
          "label": "Trips",
          "val": 1.25,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_z8736vg0t",
          "label": "Dining",
          "val": 0.43,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_jgdejs8y1",
          "label": "Salary",
          "val": 7.67,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_h7p20qjg2",
          "label": "Business Income",
          "val": 4.12,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_ftg4vjqsv",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_0nnyg2lvv",
              "label": "Marcus HYSA",
              "val": 96.66620377414836,
              "note": "3.65% APY"
            },
            {
              "id": "asset_hbvkplxve",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_jhgt7hsu6",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_p0s54rx8v",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_2o2iy5oxd",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_fhdrzabkb",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_5a82i87w9",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_ke407axs1",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_hmb0asp50",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_wfwpr55w6",
              "label": "Primary Residence (Equity)",
              "val": 77.27627953700053
            }
          ]
        },
        {
          "id": "cat_a7t6zy8zq",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_february_2025",
              "label": "Fidelity Account",
              "val": 39.281965889694675
            },
            {
              "id": "asset_schwab_february_2025",
              "label": "Charles Schwab Account",
              "val": 30.167309491940426
            }
          ]
        },
        {
          "id": "cat_j7fxr9mj2",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_m1rgc6kg1",
              "label": "Fidelity 401k",
              "val": 108.01316628207071,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_inom3836v",
              "label": "Fidelity HSA",
              "val": 11.293361194710727
            },
            {
              "id": "asset_ryor3y3ae",
              "label": "Schwab IRA",
              "val": 36.17302758392532
            },
            {
              "id": "asset_mgau3ylga",
              "label": "Schwab Roth IRA",
              "val": 28.37212201879277
            },
            {
              "id": "asset_qwhvn602v",
              "label": "Inspira Financial HSA",
              "val": 9.286015202009253
            }
          ]
        }
      ]
    },
    {
      "id": "march_2025",
      "date": "March 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_emp2z7ln7",
          "label": "Review budget for March",
          "completed": true
        },
        {
          "id": "todo_z36x392l7",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_w9am9d8bd",
          "label": "Mortgage",
          "val": 2.68,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_g6drhjgfj",
          "label": "Groceries",
          "val": 0.59,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ubvc21kfm",
          "label": "Trips",
          "val": 1.12,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_cd9ownkfs",
          "label": "Dining",
          "val": 0.45,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_g1mrnsdx3",
          "label": "Salary",
          "val": 8.01,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_55qb7vakr",
          "label": "Business Income",
          "val": 4.5,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_y71jklg5b",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_fcfnvhpph",
              "label": "Marcus HYSA",
              "val": 102.26620377414835,
              "note": "3.65% APY"
            },
            {
              "id": "asset_6h33cgrug",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_gojvpj87j",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_n4ixsb5qq",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_z5g5ckid8",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_5igt9hdto",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_i32lb5zax",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_edd05bqqc",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_vulplhfu7",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_bjrj5590s",
              "label": "Primary Residence (Equity)",
              "val": 77.37830582574277
            }
          ]
        },
        {
          "id": "cat_0xvos35qq",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_march_2025",
              "label": "Fidelity Account",
              "val": 40.76459103861087
            },
            {
              "id": "asset_schwab_march_2025",
              "label": "Charles Schwab Account",
              "val": 31.305918793050346
            }
          ]
        },
        {
          "id": "cat_vfh3rxxki",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_717stmsm9",
              "label": "Fidelity 401k",
              "val": 112.08992346865226,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_8gp50gnrz",
              "label": "Fidelity HSA",
              "val": 11.719608225475165
            },
            {
              "id": "asset_ttbczqbov",
              "label": "Schwab IRA",
              "val": 37.53831160659783
            },
            {
              "id": "asset_nuhjg3cxf",
              "label": "Schwab Roth IRA",
              "val": 29.442975289000827
            },
            {
              "id": "asset_d1nnfgukn",
              "label": "Inspira Financial HSA",
              "val": 9.636498670947065
            }
          ]
        }
      ]
    },
    {
      "id": "april_2025",
      "date": "April 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_gg7li7qn3",
          "label": "Review budget for April",
          "completed": true
        },
        {
          "id": "todo_o9pbow6af",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_yzqtsn7kq",
          "label": "Mortgage",
          "val": 2.64,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_6r7isrcjy",
          "label": "Groceries",
          "val": 0.64,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_eystjx0wc",
          "label": "Trips",
          "val": 1.31,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_edrdvxo0h",
          "label": "Dining",
          "val": 0.48,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_uv07veo7p",
          "label": "Salary",
          "val": 9.12,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_s3c1fll82",
          "label": "Business Income",
          "val": 4.51,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_4urg4hw8f",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_sysl1u1to",
              "label": "Marcus HYSA",
              "val": 107.86620377414835,
              "note": "3.65% APY"
            },
            {
              "id": "asset_6xh1z8rux",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_498zuz4gy",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_944mqkd27",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_2epucmppq",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_6jgx9qf0o",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_rqwmlg0ag",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_ci3a4iarg",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_euxj64yaa",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_v32fdf8nv",
              "label": "Primary Residence (Equity)",
              "val": 77.67271468862366
            }
          ]
        },
        {
          "id": "cat_t8jc4az5x",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_april_2025",
              "label": "Fidelity Account",
              "val": 40.96951465505102
            },
            {
              "id": "asset_schwab_april_2025",
              "label": "Charles Schwab Account",
              "val": 31.46329366010046
            }
          ]
        },
        {
          "id": "cat_0ed5bttld",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_zejkmm24l",
              "label": "Fidelity 401k",
              "val": 112.6533995614687,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_yr2dkp93s",
              "label": "Fidelity HSA",
              "val": 11.778522700995143
            },
            {
              "id": "asset_o22j6subd",
              "label": "Schwab IRA",
              "val": 37.727016714964925
            },
            {
              "id": "asset_r63bxm37r",
              "label": "Schwab Roth IRA",
              "val": 29.590985138265975
            },
            {
              "id": "asset_l219ytals",
              "label": "Inspira Financial HSA",
              "val": 9.684941353852942
            }
          ]
        }
      ]
    },
    {
      "id": "may_2025",
      "date": "May 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_e4t63344k",
          "label": "Review budget for May",
          "completed": true
        },
        {
          "id": "todo_lxi4icb9r",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_0xdd1p2e5",
          "label": "Mortgage",
          "val": 2.99,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_6i2pr4c0u",
          "label": "Groceries",
          "val": 0.69,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_dhfg89sy8",
          "label": "Trips",
          "val": 1.31,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_0oyk3w6ya",
          "label": "Dining",
          "val": 0.49,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_7z9gxkyba",
          "label": "Salary",
          "val": 9.23,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_w64yr9xhf",
          "label": "Business Income",
          "val": 4.02,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_1at9ftu5c",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_uk0439aau",
              "label": "Marcus HYSA",
              "val": 113.46620377414834,
              "note": "3.65% APY"
            },
            {
              "id": "asset_qnlm0veme",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_ip0px4gg0",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_bfdf7woj9",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_8z68vvyfx",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_dizpftak0",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_h2ceqdaw7",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_xonxk924f",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_t5c3bw0ib",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_y4vr6zcp1",
              "label": "Primary Residence (Equity)",
              "val": 77.73943245119061
            }
          ]
        },
        {
          "id": "cat_3b9gsg68a",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_may_2025",
              "label": "Fidelity Account",
              "val": 40.99803330678326
            },
            {
              "id": "asset_schwab_may_2025",
              "label": "Charles Schwab Account",
              "val": 31.48519508416654
            }
          ]
        },
        {
          "id": "cat_8dhlyyjkq",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_02p5x1gok",
              "label": "Fidelity 401k",
              "val": 112.73181696757167,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_jwpung6fj",
              "label": "Fidelity HSA",
              "val": 11.786721665265485
            },
            {
              "id": "asset_ku4sddcdz",
              "label": "Schwab IRA",
              "val": 37.75327828187997
            },
            {
              "id": "asset_ausp3k3qp",
              "label": "Schwab Roth IRA",
              "val": 29.61158325876307
            },
            {
              "id": "asset_s96pynris",
              "label": "Inspira Financial HSA",
              "val": 9.691682987768873
            }
          ]
        }
      ]
    },
    {
      "id": "june_2025",
      "date": "June 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_md0a2uk4n",
          "label": "Review budget for June",
          "completed": true
        },
        {
          "id": "todo_lqwfp1c1m",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_qtz5akmgp",
          "label": "Mortgage",
          "val": 2.78,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_aekf7s3fp",
          "label": "Groceries",
          "val": 0.64,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_4bd3nqrnt",
          "label": "Trips",
          "val": 1.3,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_m258qucvk",
          "label": "Dining",
          "val": 0.49,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1jaic3wfr",
          "label": "Salary",
          "val": 8.61,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_e7nfxj60r",
          "label": "Business Income",
          "val": 4.12,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_45jmedo6e",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_qz6zvatya",
              "label": "Marcus HYSA",
              "val": 119.06620377414833,
              "note": "3.65% APY"
            },
            {
              "id": "asset_qrgh817e1",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_xdoppo1bk",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_s4vtx4u8q",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_qty4kj4xh",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_cb157bapc",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_mefdcc5vj",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_0cqpd7jj3",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_wqyq70t8q",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_pztermexr",
              "label": "Primary Residence (Equity)",
              "val": 78.11237186184205
            }
          ]
        },
        {
          "id": "cat_locg312zu",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_june_2025",
              "label": "Fidelity Account",
              "val": 40.82694857632353
            },
            {
              "id": "asset_schwab_june_2025",
              "label": "Charles Schwab Account",
              "val": 31.353807413100977
            }
          ]
        },
        {
          "id": "cat_19q21b1d6",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_qdpb9i1nb",
              "label": "Fidelity 401k",
              "val": 112.26138726730257,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_dnis6vo3q",
              "label": "Fidelity HSA",
              "val": 11.737535693733232
            },
            {
              "id": "asset_drh1i8yin",
              "label": "Schwab IRA",
              "val": 37.59573390919032
            },
            {
              "id": "asset_55qszcyh2",
              "label": "Schwab Roth IRA",
              "val": 29.488014166987316
            },
            {
              "id": "asset_kxei0nk7m",
              "label": "Inspira Financial HSA",
              "val": 9.651239609442497
            }
          ]
        }
      ]
    },
    {
      "id": "july_2025",
      "date": "July 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_fwpvhte0m",
          "label": "Review budget for July",
          "completed": true
        },
        {
          "id": "todo_mis149zoj",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_k7tu9kksv",
          "label": "Mortgage",
          "val": 2.55,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_fz7mnzf09",
          "label": "Groceries",
          "val": 0.69,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_dnhpqshqe",
          "label": "Trips",
          "val": 1.12,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_4fxuaq0a9",
          "label": "Dining",
          "val": 0.48,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_qziy8uq95",
          "label": "Salary",
          "val": 7.95,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_sszjs8o5h",
          "label": "Business Income",
          "val": 4.13,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_0m5ye6wrx",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_8okis7q2x",
              "label": "Marcus HYSA",
              "val": 124.66620377414833,
              "note": "3.65% APY"
            },
            {
              "id": "asset_tmmzc0heq",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_yofiyb5ui",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_t2xa4soe6",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_hbxji61uk",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_xhumdq23g",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_0cd22c2mh",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_3wzjpgj5w",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_phcc3oksz",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_lvbn2v0bw",
              "label": "Primary Residence (Equity)",
              "val": 78.27472786670764
            }
          ]
        },
        {
          "id": "cat_w6elln45z",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_july_2025",
              "label": "Fidelity Account",
              "val": 42.12832326951066
            },
            {
              "id": "asset_schwab_july_2025",
              "label": "Charles Schwab Account",
              "val": 32.35322208711693
            }
          ]
        },
        {
          "id": "cat_39qig2i9r",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_bo90vbwni",
              "label": "Fidelity 401k",
              "val": 115.83976217667481,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_39i12v7le",
              "label": "Fidelity HSA",
              "val": 12.111674159742991
            },
            {
              "id": "asset_jdrll4sme",
              "label": "Schwab IRA",
              "val": 38.79411239172014
            },
            {
              "id": "asset_moe8e5miy",
              "label": "Schwab Roth IRA",
              "val": 30.427955963458366
            },
            {
              "id": "asset_mkzox7pls",
              "label": "Inspira Financial HSA",
              "val": 9.95887658510659
            }
          ]
        }
      ]
    },
    {
      "id": "august_2025",
      "date": "August 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_mhakiewoy",
          "label": "Review budget for August",
          "completed": true
        },
        {
          "id": "todo_5ezg7da44",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_eoxkuc3yl",
          "label": "Mortgage",
          "val": 2.66,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ct433lbto",
          "label": "Groceries",
          "val": 0.71,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_jhoc8k9t0",
          "label": "Trips",
          "val": 1.27,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_94dbedkmy",
          "label": "Dining",
          "val": 0.47,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_6jwvgrwxg",
          "label": "Salary",
          "val": 7.89,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_neqf6erli",
          "label": "Business Income",
          "val": 3.83,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_tjbu7oki9",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_jpn5ukvxu",
              "label": "Marcus HYSA",
              "val": 130.26620377414832,
              "note": "3.65% APY"
            },
            {
              "id": "asset_uzfc21pq8",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_2rcb8hx6m",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_wzjtuesfr",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_ydvgxo65q",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_4vnxrnnx9",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_77kqxlzmh",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_ue6yhjh81",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_xjw85l6tj",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_go9f1ot2f",
              "label": "Primary Residence (Equity)",
              "val": 78.63724127724761
            }
          ]
        },
        {
          "id": "cat_rgm4eh3uy",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_august_2025",
              "label": "Fidelity Account",
              "val": 42.79551800918341
            },
            {
              "id": "asset_schwab_august_2025",
              "label": "Charles Schwab Account",
              "val": 32.86560658079582
            }
          ]
        },
        {
          "id": "cat_dqjrjijlx",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_1tucgh1jm",
              "label": "Fidelity 401k",
              "val": 117.6743398187704,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_0ng98rxks",
              "label": "Fidelity HSA",
              "val": 12.303489182532164
            },
            {
              "id": "asset_yz74gxuqu",
              "label": "Schwab IRA",
              "val": 39.40850256225801
            },
            {
              "id": "asset_78mx6sbf0",
              "label": "Schwab Roth IRA",
              "val": 30.909849629815273
            },
            {
              "id": "asset_93eez3z06",
              "label": "Inspira Financial HSA",
              "val": 10.116597319163008
            }
          ]
        }
      ]
    },
    {
      "id": "september_2025",
      "date": "September 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_9vt8bvxjt",
          "label": "Review budget for September",
          "completed": true
        },
        {
          "id": "todo_3j5m6rzv9",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_w4ujx3pe6",
          "label": "Mortgage",
          "val": 2.75,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_im4u2mrzg",
          "label": "Groceries",
          "val": 0.71,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ohyemsw82",
          "label": "Trips",
          "val": 1.1,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zivnyv393",
          "label": "Dining",
          "val": 0.46,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_tytqdiwwn",
          "label": "Salary",
          "val": 8.2,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_yl299y2we",
          "label": "Business Income",
          "val": 4.3,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_so2k0s5pu",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_m2xims7gw",
              "label": "Marcus HYSA",
              "val": 135.86620377414832,
              "note": "3.65% APY"
            },
            {
              "id": "asset_qoq2lih95",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_30hbyd2li",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_8p64urec1",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_lakii5nt5",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_fh9x20ix9",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_guwknoaje",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_ly9ffo7yd",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_lfh5zbcd7",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_0x32ou2nt",
              "label": "Primary Residence (Equity)",
              "val": 78.92889623015176
            }
          ]
        },
        {
          "id": "cat_o9edtom69",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_september_2025",
              "label": "Fidelity Account",
              "val": 42.73610400176741
            },
            {
              "id": "asset_schwab_september_2025",
              "label": "Charles Schwab Account",
              "val": 32.81997849907231
            }
          ]
        },
        {
          "id": "cat_xlhliadmb",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_kror9lawv",
              "label": "Fidelity 401k",
              "val": 117.51096981125781,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_drdhcr30i",
              "label": "Fidelity HSA",
              "val": 12.286407963948086
            },
            {
              "id": "asset_s22iy1zel",
              "label": "Schwab IRA",
              "val": 39.353790826721
            },
            {
              "id": "asset_fqbb5fkao",
              "label": "Schwab Roth IRA",
              "val": 30.866936770699063
            },
            {
              "id": "asset_xoqxeqmmt",
              "label": "Inspira Financial HSA",
              "val": 10.102552213130725
            }
          ]
        }
      ]
    },
    {
      "id": "october_2025",
      "date": "October 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_lsx1ndobh",
          "label": "Review budget for October",
          "completed": true
        },
        {
          "id": "todo_bwx8dnwtw",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_tb3pju1us",
          "label": "Mortgage",
          "val": 2.65,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_wl8p0kkfy",
          "label": "Groceries",
          "val": 0.64,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zaiw2vkqi",
          "label": "Trips",
          "val": 1.2,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ntsglc0kv",
          "label": "Dining",
          "val": 0.42,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_v6vhvh52n",
          "label": "Salary",
          "val": 8.55,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_quk1mi6m7",
          "label": "Business Income",
          "val": 4.44,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_4rr00oagw",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_qecug2x1b",
              "label": "Marcus HYSA",
              "val": 141.4662037741483,
              "note": "3.65% APY"
            },
            {
              "id": "asset_yf9b2e4k0",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_qtks8srf0",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_b9x2eom0g",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_p26gjb3q5",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_fr1gn1fun",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_yuqy4by7e",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_8sluribjp",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_hyklzymfq",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_k6k0ri3e6",
              "label": "Primary Residence (Equity)",
              "val": 79.07355374100102
            }
          ]
        },
        {
          "id": "cat_ylhidzokt",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_october_2025",
              "label": "Fidelity Account",
              "val": 44.049511572696275
            },
            {
              "id": "asset_schwab_october_2025",
              "label": "Charles Schwab Account",
              "val": 33.828634043260934
            }
          ]
        },
        {
          "id": "cat_xck84roqd",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_u6gn821wc",
              "label": "Fidelity 401k",
              "val": 121.12243138508111,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_hdydnv303",
              "label": "Fidelity HSA",
              "val": 12.664005819819618
            },
            {
              "id": "asset_4x7gpb1eh",
              "label": "Schwab IRA",
              "val": 40.563249854956915
            },
            {
              "id": "asset_bc08scpt1",
              "label": "Schwab Roth IRA",
              "val": 31.81556953433007
            },
            {
              "id": "asset_1f6b2ox2v",
              "label": "Inspira Financial HSA",
              "val": 10.413033687106015
            }
          ]
        }
      ]
    },
    {
      "id": "november_2025",
      "date": "November 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_iwv9waxg2",
          "label": "Review budget for November",
          "completed": true
        },
        {
          "id": "todo_kgnx7o2yf",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_h4l85w2ad",
          "label": "Mortgage",
          "val": 2.88,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_3jsnpme3m",
          "label": "Groceries",
          "val": 0.6,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ejxqu70sb",
          "label": "Trips",
          "val": 1.18,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_s1o4lmj2u",
          "label": "Dining",
          "val": 0.48,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_yg2qsuatm",
          "label": "Salary",
          "val": 8.61,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_zalyuw374",
          "label": "Business Income",
          "val": 4.53,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_ohm5kxhxw",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_9lowg6ba3",
              "label": "Marcus HYSA",
              "val": 147.0662037741483,
              "note": "3.65% APY"
            },
            {
              "id": "asset_w5ksj1mh3",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_la2b0vwzz",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_rmrlf7kcp",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_i13npgoro",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_5okorqep4",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_fk9kjkg1o",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_3ojnvwepc",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_t830yv4mr",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_25mkq5kh2",
              "label": "Primary Residence (Equity)",
              "val": 79.09569018012907
            }
          ]
        },
        {
          "id": "cat_pze65aamz",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_november_2025",
              "label": "Fidelity Account",
              "val": 45.49406000077122
            },
            {
              "id": "asset_schwab_november_2025",
              "label": "Charles Schwab Account",
              "val": 34.93800162502102
            }
          ]
        },
        {
          "id": "cat_1srqm7rvi",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_j425dfzut",
              "label": "Fidelity 401k",
              "val": 125.0944894537201,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_6aa95symu",
              "label": "Fidelity HSA",
              "val": 13.079305991081712
            },
            {
              "id": "asset_pmhyir5wg",
              "label": "Schwab IRA",
              "val": 41.89347070698355
            },
            {
              "id": "asset_tdydupms3",
              "label": "Schwab Roth IRA",
              "val": 32.85892119291266
            },
            {
              "id": "asset_zpuxbe7dd",
              "label": "Inspira Financial HSA",
              "val": 10.754516053360542
            }
          ]
        }
      ]
    },
    {
      "id": "december_2025",
      "date": "December 2025",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_1msvgbec3",
          "label": "Review budget for December",
          "completed": true
        },
        {
          "id": "todo_mf3569tzb",
          "label": "Check high yield interest",
          "completed": true
        }
      ],
      "flow": [
        {
          "id": "flow_2qyrvr82t",
          "label": "Mortgage",
          "val": 2.65,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_mu8tgx7oo",
          "label": "Groceries",
          "val": 0.7,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_3urnk5ztj",
          "label": "Trips",
          "val": 1.15,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_qixn34vv1",
          "label": "Dining",
          "val": 0.45,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_tw53gaf0s",
          "label": "Salary",
          "val": 8.56,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_x0tbvdnyd",
          "label": "Business Income",
          "val": 3.99,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_dmqd0mlfe",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_t80jvy150",
              "label": "Marcus HYSA",
              "val": 152.6662037741483,
              "note": "3.65% APY"
            },
            {
              "id": "asset_8bnhuz3fs",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_w32nnqzja",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_r6mmvfff6",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_wm7ycywqe",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_tf6cybjwo",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_8hjk3ktz3",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_n3vknsfkx",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_fjm8zlyr0",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_j65zqcllq",
              "label": "Primary Residence (Equity)",
              "val": 79.1138157255786
            }
          ]
        },
        {
          "id": "cat_fht6hu8rq",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_december_2025",
              "label": "Fidelity Account",
              "val": 45.355375750963255
            },
            {
              "id": "asset_schwab_december_2025",
              "label": "Charles Schwab Account",
              "val": 34.83149650006463
            }
          ]
        },
        {
          "id": "cat_wlyk7vj6r",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_f0r2ewuci",
              "label": "Fidelity 401k",
              "val": 124.71315097953895,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_usxq9nq0p",
              "label": "Fidelity HSA",
              "val": 13.039434989475101
            },
            {
              "id": "asset_utodqfku2",
              "label": "Schwab IRA",
              "val": 41.76576250602827
            },
            {
              "id": "asset_on2rju3g8",
              "label": "Schwab Roth IRA",
              "val": 32.7587539439342
            },
            {
              "id": "asset_kp9eby64y",
              "label": "Inspira Financial HSA",
              "val": 10.721731949438341
            }
          ]
        }
      ]
    },
    {
      "id": "january_2026",
      "date": "January 2026",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_x8n14g3zd",
          "label": "Review budget for January",
          "completed": false
        },
        {
          "id": "todo_59c3oxttl",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_y6xcnb6w9",
          "label": "Mortgage",
          "val": 3.08,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1u0jc0z2x",
          "label": "Groceries",
          "val": 0.6,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_1dakjd66d",
          "label": "Trips",
          "val": 1.23,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_k9p7kl6hy",
          "label": "Dining",
          "val": 0.46,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_iisz6r47k",
          "label": "Salary",
          "val": 8.16,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_ch4cvytpr",
          "label": "Business Income",
          "val": 4.55,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_4wuohshv7",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_rs3pv1ike",
              "label": "Marcus HYSA",
              "val": 158.2662037741483,
              "note": "3.65% APY"
            },
            {
              "id": "asset_gcip9oxc7",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_o3kkrpuio",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_wv7yt689m",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_4yxgfwtya",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_7ii6ug27k",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_6qen5q8qx",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_nsa7uaesf",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_pdrqw3eis",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_5xq24bypl",
              "label": "Primary Residence (Equity)",
              "val": 79.15408723174843
            }
          ]
        },
        {
          "id": "cat_r44qs9eqg",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_january_2026",
              "label": "Fidelity Account",
              "val": 45.819338441823085
            },
            {
              "id": "asset_schwab_january_2026",
              "label": "Charles Schwab Account",
              "val": 35.18780519722059
            }
          ]
        },
        {
          "id": "cat_cqymxzt4q",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_rfljp3q31",
              "label": "Fidelity 401k",
              "val": 125.98890381271544,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_odwn57dml",
              "label": "Fidelity HSA",
              "val": 13.172821853652502
            },
            {
              "id": "asset_lhqkthyxw",
              "label": "Schwab IRA",
              "val": 42.1930052581225
            },
            {
              "id": "asset_4k1bkjca9",
              "label": "Schwab Roth IRA",
              "val": 33.09385952684231
            },
            {
              "id": "asset_asg6rz3m0",
              "label": "Inspira Financial HSA",
              "val": 10.831409876774961
            }
          ]
        }
      ]
    },
    {
      "id": "february_2026",
      "date": "February 2026",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_za5qv6ws5",
          "label": "Review budget for February",
          "completed": false
        },
        {
          "id": "todo_rceb8bj63",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_gfxl231p2",
          "label": "Mortgage",
          "val": 2.61,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_pk4458ho5",
          "label": "Groceries",
          "val": 0.59,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_vj31k41tl",
          "label": "Trips",
          "val": 1.12,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_iw7yqta6h",
          "label": "Dining",
          "val": 0.47,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ldifngr7h",
          "label": "Salary",
          "val": 8.65,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_p510e56v2",
          "label": "Business Income",
          "val": 4.17,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_enb942dr1",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_d61p0znl8",
              "label": "Marcus HYSA",
              "val": 163.8662037741483,
              "note": "3.65% APY"
            },
            {
              "id": "asset_asl9f3jfl",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_wi4saeckf",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_6zsc3pves",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_2lk4bh88p",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_zicg1hgxq",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_m87f1ia1v",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_sdyc711ef",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_tc8087lcu",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_3qzvddf4k",
              "label": "Primary Residence (Equity)",
              "val": 79.3962010622405
            }
          ]
        },
        {
          "id": "cat_o8mtqf5s6",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_february_2026",
              "label": "Fidelity Account",
              "val": 46.590592037661594
            },
            {
              "id": "asset_schwab_february_2026",
              "label": "Charles Schwab Account",
              "val": 35.78010360682071
            }
          ]
        },
        {
          "id": "cat_dakhefsqq",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_vn0o5klks",
              "label": "Fidelity 401k",
              "val": 128.1096108854438,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_gijxaiwj8",
              "label": "Fidelity HSA",
              "val": 13.394553257192282
            },
            {
              "id": "asset_h9l3l45j8",
              "label": "Schwab IRA",
              "val": 42.90321863376689
            },
            {
              "id": "asset_g47211iir",
              "label": "Schwab Roth IRA",
              "val": 33.6509116150705
            },
            {
              "id": "asset_xlt9decs8",
              "label": "Inspira Financial HSA",
              "val": 11.013729484598855
            }
          ]
        }
      ]
    },
    {
      "id": "march_2026",
      "date": "March 2026",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_movuyyqsp",
          "label": "Review budget for March",
          "completed": false
        },
        {
          "id": "todo_vie2rzwiw",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_c2huruajz",
          "label": "Mortgage",
          "val": 3.01,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_i21q6tojc",
          "label": "Groceries",
          "val": 0.66,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_zkc0vzkfs",
          "label": "Trips",
          "val": 1.29,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_rlt9ylqm5",
          "label": "Dining",
          "val": 0.49,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_ai2sa9ftd",
          "label": "Salary",
          "val": 9,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_8g3n1iiyr",
          "label": "Business Income",
          "val": 3.88,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_n5ct67eo1",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_5h2wisukp",
              "label": "Marcus HYSA",
              "val": 169.46620377414828,
              "note": "3.65% APY"
            },
            {
              "id": "asset_ackkfugtz",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_xrodpto3y",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_1ylazjemh",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_svbp0rx71",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_8ucf1uoe1",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_kslwjr8r7",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_d8xiqnd8w",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_gvqzpnpde",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_n6mphrzud",
              "label": "Primary Residence (Equity)",
              "val": 79.74045139591772
            }
          ]
        },
        {
          "id": "cat_lyl9eq5yi",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_march_2026",
              "label": "Fidelity Account",
              "val": 47.653007926421694
            },
            {
              "id": "asset_schwab_march_2026",
              "label": "Charles Schwab Account",
              "val": 36.5960054640592
            }
          ]
        },
        {
          "id": "cat_qq1mpulci",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_isvb4twwh",
              "label": "Fidelity 401k",
              "val": 131.03092354010053,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_l9qhtr0i0",
              "label": "Fidelity HSA",
              "val": 13.699992307886918
            },
            {
              "id": "asset_ni8mtgir6",
              "label": "Schwab IRA",
              "val": 43.881550506403684
            },
            {
              "id": "asset_bdzbfw2bd",
              "label": "Schwab Roth IRA",
              "val": 34.41826102205406
            },
            {
              "id": "asset_cke3v001m",
              "label": "Inspira Financial HSA",
              "val": 11.264878068190255
            }
          ]
        }
      ]
    },
    {
      "id": "april_2026",
      "date": "April 2026",
      "grossAnnual": "92",
      "netAnnual": "68",
      "netMonthly": "5.6",
      "actionItems": [
        {
          "id": "todo_kbqrxtkpn",
          "label": "Review budget for April",
          "completed": false
        },
        {
          "id": "todo_7qe9kwllv",
          "label": "Check high yield interest",
          "completed": false
        }
      ],
      "flow": [
        {
          "id": "flow_ib1st4zvf",
          "label": "Mortgage",
          "val": 2.84,
          "color": "bg-flowExpense",
          "type": "Housing",
          "parentCategory": "expense"
        },
        {
          "id": "flow_mo1wt9lau",
          "label": "Groceries",
          "val": 0.68,
          "color": "bg-flowExpense",
          "type": "Food",
          "parentCategory": "expense"
        },
        {
          "id": "flow_9kkimmml7",
          "label": "Trips",
          "val": 1.31,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_gqnlow0zf",
          "label": "Dining",
          "val": 0.46,
          "color": "bg-flowExpense",
          "type": "Flex",
          "parentCategory": "expense"
        },
        {
          "id": "flow_pq4fx0saj",
          "label": "Salary",
          "val": 8.46,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        },
        {
          "id": "flow_yvtgbu6qg",
          "label": "Business Income",
          "val": 3.89,
          "color": "bg-assetBlue",
          "type": "Income",
          "parentCategory": "savings"
        }
      ],
      "assetCategories": [
        {
          "id": "cat_u0x0qvk8r",
          "label": "Cash",
          "color": "bg-assetBlue",
          "assets": [
            {
              "id": "asset_11oj8w9ys",
              "label": "Marcus HYSA",
              "val": 175.06620377414828,
              "note": "3.65% APY"
            },
            {
              "id": "asset_i82qyun2p",
              "label": "Chase Checking",
              "val": 5.6
            },
            {
              "id": "asset_6ymilzbup",
              "label": "Betterment Cash Reserve",
              "val": 12.26
            },
            {
              "id": "asset_5jfzmcm76",
              "label": "Amex HYSA",
              "val": 15.03
            }
          ]
        },
        {
          "id": "cat_rwouzktte",
          "label": "Company",
          "color": "bg-assetCyan",
          "assets": [
            {
              "id": "asset_rpmener73",
              "label": "E-Commerce Store",
              "val": 65.24
            },
            {
              "id": "asset_0wlex22fh",
              "label": "Personal Business",
              "val": 172.69
            }
          ]
        },
        {
          "id": "cat_rkit4pdfb",
          "label": "Tangible",
          "color": "bg-assetOrange",
          "assets": [
            {
              "id": "asset_rcb4b5gwq",
              "label": "Subaru Outback (Equity)",
              "val": 32.38,
              "note": "Subaru Guaranteed Value"
            },
            {
              "id": "asset_nb5adwdpk",
              "label": "Primary Residence (Equity)",
              "val": 80
            }
          ]
        },
        {
          "id": "cat_p08pupgzs",
          "label": "Investments",
          "color": "bg-assetGreen",
          "assets": [
            {
              "id": "asset_fidelity_april_2026",
              "label": "Fidelity Account",
              "val": 48.14
            },
            {
              "id": "asset_schwab_april_2026",
              "label": "Charles Schwab Account",
              "val": 36.97
            }
          ]
        },
        {
          "id": "cat_o2g0is6re",
          "label": "Retirement",
          "color": "bg-assetPurple",
          "assets": [
            {
              "id": "asset_ix1oeoqv2",
              "label": "Fidelity 401k",
              "val": 132.37,
              "note": "Contributing 6% 401k Roth + 3% employer match"
            },
            {
              "id": "asset_b7pitspk6",
              "label": "Fidelity HSA",
              "val": 13.84
            },
            {
              "id": "asset_81z97mk76",
              "label": "Schwab IRA",
              "val": 44.33
            },
            {
              "id": "asset_zsgrbwpnl",
              "label": "Schwab Roth IRA",
              "val": 34.77
            },
            {
              "id": "asset_cb05ueiay",
              "label": "Inspira Financial HSA",
              "val": 11.38
            }
          ]
        }
      ]
    }
  ],
  "marbleMultiplier": 1000,
  "snapshots": {},
  "customColors": [
    "#82C4C3",
    "#8294C4",
    "#C482A2"
  ]
};
