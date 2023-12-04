<?php

namespace App\Apis\Pipedrive\Mocks;

class PipedriveDealApiMock
{
    public static function getDeal()
    {
        return json_decode('{
            "success": true,
            "data": {
                "id": 16225,
                "creator_user_id": {
                    "id": 16813640,
                    "name": "Matias Duette",
                    "email": "mduette@hoggax.com",
                    "has_pic": 1,
                    "pic_hash": "fd6ed29711794e5f03bb06ced22951e4",
                    "active_flag": true,
                    "value": 16813640
                },
                "user_id": {
                    "id": 16813640,
                    "name": "Matias Duette",
                    "email": "mduette@hoggax.com",
                    "has_pic": 1,
                    "pic_hash": "fd6ed29711794e5f03bb06ced22951e4",
                    "active_flag": true,
                    "value": 16813640
                },
                "person_id": {
                    "active_flag": true,
                    "name": "Conde Maria Victoria",
                    "email": [
                        {
                            "label": "work",
                            "value": "mavico@outlook.com",
                            "primary": true
                        }
                    ],
                    "phone": [
                        {
                            "label": "work",
                            "value": "11 3095-8143",
                            "primary": true
                        }
                    ],
                    "owner_id": 16813640,
                    "value": 53541
                },
                "org_id": {
                    "name": "Dipachi",
                    "people_count": 4,
                    "owner_id": 9547225,
                    "address": "Tres Sargentos 1855 Gerli, Avellaneda",
                    "active_flag": true,
                    "cc_email": "hoggax-4591cd@pipedrivemail.com",
                    "owner_name": "Melisa Reyes",
                    "value": 16
                },
                "stage_id": 39,
                "title": "Poliza Conde Maria Victoria",
                "value": 0,
                "currency": "ARS",
                "add_time": "2023-09-28 17:40:45",
                "update_time": "2023-10-09 17:52:21",
                "stage_change_time": "2023-10-09 17:52:20",
                "active": false,
                "deleted": false,
                "status": "won",
                "probability": null,
                "next_activity_date": null,
                "next_activity_time": null,
                "next_activity_id": null,
                "last_activity_id": 106810,
                "last_activity_date": "2023-10-04",
                "lost_reason": null,
                "visible_to": "3",
                "close_time": "2023-10-09 17:52:21",
                "pipeline_id": 8,
                "won_time": "2023-10-09 17:52:21",
                "first_won_time": "2023-10-09 17:52:21",
                "lost_time": null,
                "products_count": 0,
                "files_count": 0,
                "notes_count": 1,
                "followers_count": 14,
                "email_messages_count": 4,
                "activities_count": 2,
                "done_activities_count": 2,
                "undone_activities_count": 0,
                "participants_count": 1,
                "expected_close_date": null,
                "last_incoming_mail_time": "2023-10-02 19:45:01",
                "last_outgoing_mail_time": "2023-10-09 17:49:00",
                "label": null,
                "stage_order_nr": 5,
                "person_name": "Conde Maria Victoria",
                "org_name": "Dipachi",
                "next_activity_subject": null,
                "next_activity_type": null,
                "next_activity_duration": null,
                "next_activity_note": null,
                "formatted_value": "0 ARS",
                "weighted_value": 0,
                "formatted_weighted_value": "0 ARS",
                "weighted_value_currency": "ARS",
                "rotten_time": null,
                "owner_name": "Matias Duette",
                "cc_email": "hoggax-4591cd+deal16225@pipedrivemail.com",
                "cdb970543472a824175760f82dcebdf086b58982": "124",
                "9f7f9771196d1733a7b1b872f624ddcc6b125f3a": null,
                "2c965d889729d4725843c1ce088a88662c3ea774": null,
                "8ea899126b90bff917d60ed7d3d9ad3887548860": "0720053388000037473468",
                "e4b9870fc7026cce1de76b5f1f9775007ca08c1e": null,
                "fa2fd76467a13f0643892b59d3caedf259b40a33": null,
                "fa2fd76467a13f0643892b59d3caedf259b40a33_currency": null,
                "5a5fe2779f558810d621f1ab1fe4a670be5260c9": null,
                "5a5fe2779f558810d621f1ab1fe4a670be5260c9_currency": null,
                "90dabdd5828b3b0cf1b3568c64048c14cb7cc589": null,
                "ec150758578690c05c898ce7ede842dab59c64d6": "357",
                "98f78573b47a08635796c32605514bde6293a683": null,
                "1b4d4d1ab00c2f6edc5b32d340f184ce07061635": null,
                "38a1d2f94bb731c56ec0bca729ccbc0a35ec70b8": null,
                "38a1d2f94bb731c56ec0bca729ccbc0a35ec70b8_currency": null,
                "9fe059f771ea603fdda887826c577c3b23db04c1": null,
                "9fe059f771ea603fdda887826c577c3b23db04c1_currency": null,
                "7cc1d8d1ac5aae0946074cd44d3ccbd3269ca41f": null,
                "7cc1d8d1ac5aae0946074cd44d3ccbd3269ca41f_currency": null,
                "3a5826d011b9cbba825d5b61eeac9b4d77760dd4": null,
                "3a5826d011b9cbba825d5b61eeac9b4d77760dd4_currency": null,
                "645aa2ae5bff397bacd8486b1991ec5b69d68ec7": null,
                "645aa2ae5bff397bacd8486b1991ec5b69d68ec7_currency": null,
                "e39ade4fddc0b78bb3598ef28cb9454ee213cd65": null,
                "e39ade4fddc0b78bb3598ef28cb9454ee213cd65_currency": null,
                "494f310d46fc11f20d01d64b79ad52226bc25924": "Bahia Blanca - 73 - 5 - A, Avellaneda, Buenos Aires, 1875",
                "1a3a9de2cea511ac8963efb2c40f999c8543b4ee": 2,
                "38267fb741bfcf6f62221428a29568a5ca1bfc3b": null,
                "38267fb741bfcf6f62221428a29568a5ca1bfc3b_currency": null,
                "d33352ba508c13684d79dfb2c57f9a4fcf059029": "xx",
                "f5bfea2dc9f27d1fd6ede91936de10d4d9a8cc13": "2023-08-01",
                "f5bfea2dc9f27d1fd6ede91936de10d4d9a8cc13_until": "2025-07-31",
                "55d32ea0b0a990ba2971c46fbccc2be876eb6fed": "27071314F151507-HS",
                "88a142d827cfa04a6acac22ab305b59d9eab1335": {
                    "active_flag": true,
                    "name": "Conde Maria Victoria",
                    "email": [
                        {
                            "label": "work",
                            "value": "mavico@outlook.com",
                            "primary": true
                        }
                    ],
                    "phone": [
                        {
                            "label": "work",
                            "value": "11 3095-8143",
                            "primary": true
                        }
                    ],
                    "owner_id": 16813640,
                    "value": 53541
                },
                "38203bb8d50c5f5b59b35ed9d223208723a4003d": null,
                "c641a957d27aa282c608853bae29001d33c986a5": null,
                "0b2ec04f256ae5bad4572ffd3bdb33492f64a446": null,
                "141f085132c089a8d416c47d6877595daaeb7036": null,
                "dd0babb91877145638b3c58dcc520cb99a26badb": "365",
                "09ec423c7f6759b26994bfac13810597d53cba92": "375",
                "028bae9a6aa7744eabccd9d075d1fa452e3c2d86": "414",
                "4188207c795dc875c90849a369b43374a3025567": null,
                "58de738237554b651d201e38623f2fb52e1e9181": "408",
                "org_hidden": false,
                "person_hidden": false,
                "average_time_to_won": {
                    "y": 0,
                    "m": 0,
                    "d": 0,
                    "h": 0,
                    "i": 0,
                    "s": 0,
                    "total_seconds": 0
                },
                "average_stage_progress": 0,
                "age": {
                    "y": 0,
                    "m": 0,
                    "d": 11,
                    "h": 0,
                    "i": 11,
                    "s": 36,
                    "total_seconds": 951096
                },
                "stay_in_pipeline_stages": {
                    "times_in_stages": {
                        "35": 1583,
                        "36": 0,
                        "37": 439228,
                        "38": 510283,
                        "39": 1
                    },
                    "order_of_stages": [
                        35,
                        36,
                        37,
                        38,
                        39
                    ]
                },
                "last_activity": {
                    "id": 106810,
                    "company_id": 6341423,
                    "user_id": 14746927,
                    "done": true,
                    "type": "call",
                    "reference_type": null,
                    "reference_id": null,
                    "conference_meeting_client": null,
                    "conference_meeting_url": null,
                    "due_date": "2023-10-04",
                    "due_time": "",
                    "duration": "",
                    "busy_flag": false,
                    "add_time": "2023-09-28 19:18:23",
                    "marked_as_done_time": "2023-10-03 20:07:34",
                    "last_notification_time": null,
                    "last_notification_user_id": null,
                    "notification_language_id": null,
                    "subject": "Firma ok - envío a HS",
                    "public_description": "",
                    "calendar_sync_include_context": null,
                    "location": null,
                    "org_id": 16,
                    "person_id": 53541,
                    "deal_id": 16225,
                    "lead_id": null,
                    "project_id": null,
                    "active_flag": true,
                    "update_time": "2023-10-03 20:07:34",
                    "update_user_id": 14746927,
                    "source_timezone": null,
                    "rec_rule": null,
                    "rec_rule_extension": null,
                    "rec_master_activity_id": null,
                    "conference_meeting_id": null,
                    "original_start_time": null,
                    "private": false,
                    "note": "LegalSign está fallando",
                    "created_by_user_id": 14746927,
                    "location_subpremise": null,
                    "location_street_number": null,
                    "location_route": null,
                    "location_sublocality": null,
                    "location_locality": null,
                    "location_admin_area_level_1": null,
                    "location_admin_area_level_2": null,
                    "location_country": null,
                    "location_postal_code": null,
                    "location_formatted_address": null,
                    "attendees": null,
                    "participants": [
                        {
                            "person_id": 53541,
                            "primary_flag": true
                        }
                    ],
                    "series": null,
                    "is_recurring": null,
                    "org_name": "Dipachi",
                    "person_name": "Conde Maria Victoria",
                    "deal_title": "Poliza Conde Maria Victoria",
                    "lead_title": null,
                    "project_title": null,
                    "owner_name": "Flor Miguelez",
                    "person_dropbox_bcc": "hoggax-4591cd@pipedrivemail.com",
                    "deal_dropbox_bcc": "hoggax-4591cd+deal16225@pipedrivemail.com",
                    "assigned_to_user_id": 14746927,
                    "type_name": "Llamada",
                    "lead": null
                },
                "next_activity": null
            },
            "additional_data": {
                "dropbox_email": "hoggax-4591cd+deal16225@pipedrivemail.com"
            },
            "related_objects": {
                "user": {
                    "16813640": {
                        "id": 16813640,
                        "name": "Matias Duette",
                        "email": "mduette@hoggax.com",
                        "has_pic": 1,
                        "pic_hash": "fd6ed29711794e5f03bb06ced22951e4",
                        "active_flag": true
                    }
                },
                "organization": {
                    "16": {
                        "id": 16,
                        "name": "Dipachi",
                        "people_count": 4,
                        "owner_id": 9547225,
                        "address": "Tres Sargentos 1855 Gerli, Avellaneda",
                        "active_flag": true,
                        "cc_email": "hoggax-4591cd@pipedrivemail.com",
                        "owner_name": "Melisa Reyes"
                    }
                },
                "pipeline": {
                    "8": {
                        "id": 8,
                        "name": "Seguros Hipotecario",
                        "url_title": "Seguros-Hipotecario",
                        "order_nr": 4,
                        "active": true,
                        "deal_probability": true,
                        "add_time": "2022-07-22 20:35:11",
                        "update_time": "2022-07-22 20:35:11"
                    }
                },
                "person": {
                    "53541": {
                        "active_flag": true,
                        "id": 53541,
                        "name": "Conde Maria Victoria",
                        "email": [
                            {
                                "label": "work",
                                "value": "mavico@outlook.com",
                                "primary": true
                            }
                        ],
                        "phone": [
                            {
                                "label": "work",
                                "value": "11 3095-8143",
                                "primary": true
                            }
                        ],
                        "owner_id": 16813640
                    }
                },
                "stage": {
                    "39": {
                        "id": 39,
                        "company_id": 6341423,
                        "order_nr": 5,
                        "name": "Envío de Póliza",
                        "active_flag": true,
                        "deal_probability": 100,
                        "pipeline_id": 8,
                        "rotten_flag": true,
                        "rotten_days": 1,
                        "add_time": "2022-07-22 20:35:11",
                        "update_time": "2022-07-22 20:35:11",
                        "pipeline_name": "Seguros Hipotecario",
                        "pipeline_deal_probability": true
                    }
                }
            }
        }', false);
    }
}
