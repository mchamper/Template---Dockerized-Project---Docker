<?php

namespace App\Apis\Pipedrive\Mocks;

class PipedrivePersonApiMock
{
    public static function getPerson()
    {
        return json_decode('{
            "success": true,
            "data": {
                "id": 53541,
                "company_id": 6341423,
                "owner_id": {
                    "id": 16813640,
                    "name": "Matias Duette",
                    "email": "mduette@hoggax.com",
                    "has_pic": 1,
                    "pic_hash": "fd6ed29711794e5f03bb06ced22951e4",
                    "active_flag": true,
                    "value": 16813640
                },
                "org_id": {
                    "name": "Papucci Propiedades",
                    "people_count": 6,
                    "owner_id": 12264613,
                    "address": "Av. Pte. Perón 400, San Fernando, Buenos Aires, Argentina",
                    "active_flag": true,
                    "cc_email": "hoggax-4591cd@pipedrivemail.com",
                    "owner_name": "Federico Glorioso",
                    "value": 12
                },
                "name": "Conde Maria Victoria",
                "first_name": "Conde Maria",
                "last_name": "Victoria",
                "open_deals_count": 0,
                "related_open_deals_count": 0,
                "closed_deals_count": 1,
                "related_closed_deals_count": 1,
                "participant_open_deals_count": 0,
                "participant_closed_deals_count": 0,
                "email_messages_count": 4,
                "activities_count": 2,
                "done_activities_count": 2,
                "undone_activities_count": 0,
                "files_count": 0,
                "notes_count": 1,
                "followers_count": 1,
                "won_deals_count": 1,
                "related_won_deals_count": 1,
                "lost_deals_count": 0,
                "related_lost_deals_count": 0,
                "active_flag": true,
                "phone": [
                    {
                        "label": "work",
                        "value": "11 3095-8143",
                        "primary": true
                    }
                ],
                "email": [
                    {
                        "label": "work",
                        "value": "mavico@outlook.com",
                        "primary": true
                    }
                ],
                "first_char": "c",
                "update_time": "2023-10-09 17:52:21",
                "delete_time": null,
                "add_time": "2023-09-28 17:40:45",
                "visible_to": "3",
                "picture_id": null,
                "next_activity_date": null,
                "next_activity_time": null,
                "next_activity_id": null,
                "last_activity_id": 106810,
                "last_activity_date": "2023-10-04",
                "last_incoming_mail_time": "2023-10-02 19:45:01",
                "last_outgoing_mail_time": "2023-10-09 17:49:00",
                "label": 61,
                "im": [
                    {
                        "value": "",
                        "primary": true
                    }
                ],
                "postal_address": "Bahia blanca 73 piso 5 dpto a wilde avellaneda",
                "postal_address_subpremise": "piso 5 dpto a",
                "postal_address_street_number": "73",
                "postal_address_route": "Bahía Blanca",
                "postal_address_sublocality": null,
                "postal_address_locality": "Wilde",
                "postal_address_admin_area_level_1": "Provincia de Buenos Aires",
                "postal_address_admin_area_level_2": "Avellaneda",
                "postal_address_country": "Argentina",
                "postal_address_postal_code": "B1875",
                "postal_address_formatted_address": "Bahía Blanca 73 piso 5 dpto a, B1875CXB Wilde, Provincia de Buenos Aires, Argentina",
                "notes": null,
                "birthday": "1979-03-28",
                "job_title": null,
                "org_name": "Papucci Propiedades",
                "cc_email": "hoggax-4591cd@pipedrivemail.com",
                "primary_email": "mavico@outlook.com",
                "owner_name": "Matias Duette",
                "821c47d0442a24657fffd45cc395a9d06aaea387": null,
                "49c476ebb4158ce91dd263171bc72d400d7a1048": "49",
                "decffe814f28619abb91d08a645da9773d657d55": null,
                "decffe814f28619abb91d08a645da9773d657d55_currency": null,
                "e281566497770d52896f2bf50b9769bb8be14198": "114",
                "5156710975b7c2ae9c9b2f1c36a4a56fc281eb24": 27071314,
                "b9920826ac2cbd4f22aa0f82ca8ddeac1efb1906": "108",
                "bbb0b09ae8ee9cbe7b1ec14a73ba476805b2b5f1": "23-27071314-9",
                "d5d687c37db1ab0478ec15193f3ab776d30d6443": "wa.me/5491130958143",
                "cc54ca1ea5fb41ed981834a8303d0dd58cfeda9f": {
                    "name": "Dipachi",
                    "people_count": 4,
                    "owner_id": 9547225,
                    "address": "Tres Sargentos 1855 Gerli, Avellaneda",
                    "active_flag": true,
                    "cc_email": "hoggax-4591cd@pipedrivemail.com",
                    "owner_name": "Melisa Reyes",
                    "value": 16
                },
                "3c80a07fd5220457b54c62696ddf889d545c057d": null,
                "eec2c880eb2720b2a89700eddf809112d93655c1": null,
                "0f339d5f9ecfc9ed8d170db73b0f2deea271bb59": "372",
                "a10333b641d3817120925ca7be18ef90d230b920": "1979-03-28",
                "20792bdcaf80417cd4698b828755597bbf18ff8e": "Maria Victoria",
                "d44fc56031d43eaf8127183c02304d5b2d35025c": "Conde",
                "fd7796349933f9c0d089cdca6a0a1dc57306eabd": null
            }
        }', false);
    }
}
