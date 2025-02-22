"""empty message

Revision ID: b04bdb1e2c95
Revises: aaa3899aa912
Create Date: 2025-02-10 03:05:58.602136

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b04bdb1e2c95'
down_revision = 'aaa3899aa912'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('secret', schema=None) as batch_op:
        batch_op.drop_constraint('secret_email_key', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('secret', schema=None) as batch_op:
        batch_op.create_unique_constraint('secret_email_key', ['email'])

    # ### end Alembic commands ###
