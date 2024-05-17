# library_management/library_management/external_data.py
import pymysql
import frappe


def get_external_data():
    # Connect to the external MySQL database
    connection = pymysql.connect(
        host='db.czh42hccidvb.ap-southeast-1.rds.amazonaws.com',
        port=3306,
        user='TTW2P_User',
        password='eU8-S_2bro58_8PPiF1J',
        database='TTW2P'
    )

    try:
        with connection.cursor() as cursor:
            # Example query to retrieve data from an external table
            sql = """SELECT
                CarRegister AS 'vehicle_no',
                WeightTimeIn as 'weight_time_in',
                WeightIn as 'weight_in',
                WeightTimeOut as 'weight_time_out',
                WeightOut as 'weight_out',
                Weight as 'weight',
                WeightNet as 'weight_net',
                SequenceWeightOut as 'sequence_weight_out'
            FROM
                Weight"""
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    except Exception as e:
        frappe.log_error(
            _("Error retrieving external data: {0}").format(str(e)))
        return None
    finally:
        connection.close()

@frappe.whitelist()
def fetch_external_data():
    external_data = get_external_data()
    # Process and return the retrieved data as needed
    return external_data
