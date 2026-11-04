# pg-sequelize

## Sequelize Script

...bash
npx sequelize-cli model:generate --name internal --attributes internal_code:string,first_name:string,last_name:string,title:string,extension:string,work_phone:string,address:string,city:string,state_or_province:string,postal_code:string,country:string,email:string,phone:string

npx sequelize-cli model:generate --name external --attributes external_code:string,name:string,npwp:string,contact_name:string,contact_title:string,address:string,city:string,state_or_province:string,postal_code:string,country:string,email:string,phone:string,fax:string,payment_terms:string,notes:string,flag:string,segment_type:string

npx sequelize-cli model:generate --name account_category --attributes account_code:string,name1:string,name2:string,name3:string,name4:string,name5:string,level:integer,group:string,condition:string,report:string

npx sequelize-cli model:generate --name business_unit --attributes business_code:string,name:string,contact_person:string,title:string,extension:string,work_phone:string,address:string,city:string,state_or_province:string,postal_code:string,country:string,email:string,phone:string

npx sequelize-cli model:generate --name project --attributes project_code:string,name:string,key_person_id:string,customer_id:string,description:string,contact:string,contact_date:date,contact_check:string,wo:string,wo_date:date,wo_check:string,value:integer,budget:integer,address1:string,address2:string,phone1:string,phone2:string,invoice:string,invoice_date:date,invoice_check:string,compilation:string,compilation_date:date,compilation_check:string,start:string,start_date:date,start_check:string

npx sequelize-cli model:generate --name user --attributes user_name:string,name:string,password:string,business_code:string,level:integer

npx sequelize-cli model:generate --name temp_journal --attributes rtanggal:date,rreferensi:string,rreftgl:date,rrefpada:string,rrefterang:string,rqty:integer,runit:string,rprice:decimal,rkodepro:string,rkodeext:string,rkodeint:string,rkoderek:string,rkodeinv:string,rkodepo:string,rbdebet:decimal,rbkredit:decimal,rsaldo:decimal,rdebet:decimal,rkredit:decimal,redebet:decimal,rekredit:decimal,rjumlah:decimal,rkredeb:string,flag:string,fdate:date,ftime:time,userid:string,bunit:string

npx sequelize-cli model:generate --name temp_transaction --attributes rtanggal:date,rreferensi:string,rterang:string,rjumlah:decimal,flag:string,flagpost:string,bunit:string
...

npx sequelize-cli model:generate --name journal --attributes rtanggal:date,rreferensi:string,rreftgl:date,rrefpada:string,rrefterang:string,rqty:integer,runit:string,rprice:decimal,rkodepro:string,rkodeext:string,rkodeint:string,rkoderek:string,rkodeinv:string,rkodepo:string,rbdebet:decimal,rbkredit:decimal,rsaldo:decimal,rdebet:decimal,rkredit:decimal,redebet:decimal,rekredit:decimal,rjumlah:decimal,rkredeb:string,flag:string,fdate:date,ftime:time,userid:string,bunit:string

npx sequelize-cli model:generate --name transaction --attributes rtanggal:date,rreferensi:string,rterang:string,rjumlah:integer,flag:string,flagpost:string,bunit:string
...

npx sequelize-cli model:generate --name project_journal --attributes rtanggal:date,rreferensi:string,rreftgl:date,rrefpada:string,rrefterang:string,rqty:integer,runit:string,rprice:decimal,rkodepro:string,rkodeext:string,rkodeint:string,rkoderek:string,rkodeinv:string,rkodepo:string,rbdebet:decimal,rbkredit:decimal,rsaldo:decimal,rdebet:decimal,rkredit:decimal,redebet:decimal,rekredit:decimal,rjumlah:decimal,rkredeb:string,flag:string,fdate:date,ftime:time,userid:string,bunit:string

npx sequelize-cli model:generate --name new_transaction --attributes project_id:string,name:string,location:string,range:string,qty:integer,approval:string

npx sequelize-cli model:generate --name ho-advance --attributes pct_id:string,total_cost_1:decimal,third_party_tax:decimal,cost_of_money:decimal,sales_markrting_cost:decimal,total_cost_2:decimal,grand_total_cost:decimal,boq_value:decimal,pph_and_risk:decimal,nett_revenue:decimal,management_fee:decimal,management_fee_percent:decimal
