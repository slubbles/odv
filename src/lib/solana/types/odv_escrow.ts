/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/odv_escrow.json`.
 */
export type OdvEscrow = {
  "address": "4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA",
  "metadata": {
    "name": "odvEscrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveMilestone",
      "docs": [
        "Admin approves milestone after reviewing proof"
      ],
      "discriminator": [
        145,
        85,
        92,
        60,
        50,
        130,
        219,
        106
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "fund",
      "discriminator": [
        218,
        188,
        111,
        221,
        152,
        113,
        174,
        7
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "campaignVault",
          "writable": true
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "backerTokenAccount",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goal",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "i64"
        },
        {
          "name": "milestones",
          "type": {
            "vec": {
              "defined": {
                "name": "milestoneInput"
              }
            }
          }
        }
      ]
    },
    {
      "name": "initializePlatform",
      "docs": [
        "Initialize platform configuration (one-time, admin only)"
      ],
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "fixedBackingAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pausePlatform",
      "docs": [
        "Pause platform (emergency stop, admin only)"
      ],
      "discriminator": [
        232,
        46,
        204,
        130,
        181,
        0,
        172,
        57
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "refundCampaign",
      "docs": [
        "Refund all backers if campaign fails to reach goal by deadline"
      ],
      "discriminator": [
        232,
        19,
        109,
        7,
        229,
        33,
        157,
        226
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "campaignVault",
          "writable": true
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "backerTokenAccount",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "rejectMilestone",
      "docs": [
        "Admin rejects milestone and requires resubmission"
      ],
      "discriminator": [
        243,
        48,
        66,
        165,
        237,
        41,
        116,
        249
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "releaseMilestone",
      "discriminator": [
        56,
        2,
        199,
        164,
        184,
        108,
        167,
        222
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "campaignVault",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "submitMilestoneProof",
      "docs": [
        "Creator submits proof for current active milestone"
      ],
      "discriminator": [
        95,
        246,
        144,
        35,
        212,
        197,
        162,
        197
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "proofUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "unpausePlatform",
      "docs": [
        "Unpause platform (admin only)"
      ],
      "discriminator": [
        167,
        253,
        251,
        188,
        221,
        230,
        32,
        165
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "updateBackingAmount",
      "docs": [
        "Update fixed backing amount (admin only)"
      ],
      "discriminator": [
        243,
        169,
        199,
        94,
        160,
        143,
        167,
        221
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "newAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "platformConfig",
      "discriminator": [
        160,
        78,
        128,
        0,
        248,
        83,
        230,
        160
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "noMoreMilestones",
      "msg": "No more milestones to release"
    },
    {
      "code": 6001,
      "name": "milestoneNotApproved",
      "msg": "Milestone is not approved yet"
    },
    {
      "code": 6002,
      "name": "milestoneNotActive",
      "msg": "Milestone is not in active state"
    },
    {
      "code": 6003,
      "name": "milestoneNotInReview",
      "msg": "Milestone is not in review state"
    },
    {
      "code": 6004,
      "name": "unauthorizedAdmin",
      "msg": "Unauthorized: Only admin can perform this action"
    },
    {
      "code": 6005,
      "name": "unauthorizedWithdrawal",
      "msg": "Unauthorized: Only creator can withdraw funds"
    },
    {
      "code": 6006,
      "name": "goalNotReached",
      "msg": "Goal not reached: Cannot release funds until funding goal is met"
    },
    {
      "code": 6007,
      "name": "platformPaused",
      "msg": "Platform is paused: Operations are temporarily disabled"
    },
    {
      "code": 6008,
      "name": "deadlineNotReached",
      "msg": "Deadline not reached: Cannot refund until campaign deadline passes"
    },
    {
      "code": 6009,
      "name": "goalAlreadyReached",
      "msg": "Goal already reached: Cannot refund successful campaign"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "raised",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "backerCount",
            "type": "u64"
          },
          {
            "name": "currentMilestoneIndex",
            "type": "u8"
          },
          {
            "name": "milestones",
            "type": {
              "vec": {
                "defined": {
                  "name": "milestone"
                }
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "milestoneStatus"
              }
            }
          },
          {
            "name": "proofUrl",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "submittedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "votesApprove",
            "type": "u64"
          },
          {
            "name": "votesDispute",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "milestoneInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "milestoneStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "locked"
          },
          {
            "name": "active"
          },
          {
            "name": "inReview"
          },
          {
            "name": "approved"
          },
          {
            "name": "completed"
          },
          {
            "name": "disputed"
          }
        ]
      }
    },
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "fixedBackingAmount",
            "type": "u64"
          },
          {
            "name": "totalCampaigns",
            "type": "u64"
          },
          {
            "name": "totalBackers",
            "type": "u64"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
